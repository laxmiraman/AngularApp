using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PACCAR_App.Models;
using Microsoft.EntityFrameworkCore;

namespace PACCAR_App.Services
{
    public class ProductionDataService
    {
        IPACCARContext _context; // db context

        public ProductionDataService(IPACCARContext context)
        {
            _context = context;
        }

        // This function gets the production data values given a date and location
        public string getProductionData(DateTime date, int locationID)
        {

            // create records that do note exist
            createRecords(date, locationID);

            IEnumerable<Metrics> metrics = _context.Metrics.ToList();
            IEnumerable<ProductionData> productionData = _context.ProductionData.ToList();
            IEnumerable<MetricsAvailability> metricsAvailability = _context.MetricsAvailability.ToList();
            IEnumerable<Locations> locations = _context.Locations.ToList();
            IEnumerable<MetricsGroup> metricsGroup = _context.MetricsGroup.ToList();
            IEnumerable<MetricsDataType> metricsDataType = _context.MetricsDataType.ToList();


            var dataOutput = from prodData in productionData
                             join m in metrics on prodData.MetricsId equals m.Id
                             join metricAvail in metricsAvailability
                             on new { prodData.LocationsId, prodData.MetricsId } equals new { metricAvail.LocationsId, metricAvail.MetricsId }
                             join location in locations on prodData.LocationsId equals location.Id
                             join mGroup in metricsGroup on m.MetricsGroupId equals mGroup.Id
                             join mDataType in metricsDataType on m.MetricsDataType equals mDataType.Id
                             where prodData.Date.Date == date.Date && metricAvail.LocationsId == locationID && date.Date >= metricAvail.Startdate.Value.Date
                                      && date.Date <= (metricAvail.Enddate == null ? date.Date : metricAvail.Enddate.Value.Date)
                             orderby mGroup.Id ascending, m.Name ascending
                             select new
                             {
                                 ID = prodData.Id,
                                 MetricID = m.Id,
                                 Date = prodData.Date,
                                 MetricName = m.Name,
                                 MetricGroup = mGroup.GroupName,
                                 MetricsDataType = mDataType.Type,
                                 Plan = prodData.Plan,
                                 Day = prodData.Day,
                                 Mtd = prodData.Mtd,
                                 Ytd = prodData.Ytd,
                                 DayValueActionType = m.DayValueActionType,
                                 PlanValueActionType = m.PlanValueActionType,
                                 MtdValueActionType = m.MtdValueActionType,
                                 YtdValueActionType = m.YtdValueActionType,
                                 Comments = prodData.Comments,
                                 Location = location.Name
                             };


            string json = JsonConvert.SerializeObject(dataOutput);
            return json;
        }

        // Creates records if records do not exist in database
        public void createRecords(DateTime date, int locationID)
        {
            IEnumerable<ProductionData> productionData = _context.ProductionData.ToList();
            IEnumerable<MetricsAvailability> metricsAvailability = _context.MetricsAvailability.ToList();


            var dataToCreate = (from metricsAvail in metricsAvailability
                                where metricsAvail.LocationsId == locationID && date.Date >= metricsAvail.Startdate.Value.Date
                                      && date.Date <= (metricsAvail.Enddate == null ? date.Date : metricsAvail.Enddate.Value.Date)
                                select metricsAvail.MetricsId)
                                       .Except(
                                                from prodData in productionData
                                                where prodData.LocationsId == locationID && prodData.Date == date.Date
                                                select prodData.MetricsId
                                              ).ToList();

            foreach (var record in dataToCreate)
            {
                ProductionData data = new ProductionData
                {
                    MetricsId = record,
                    LocationsId = locationID,
                    Date = date
                };

                // Submit the database context
                _context.ProductionData.Add(data);
            }

            // Save changes to database
            try
            {
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                Console.WriteLine(e); // TODO: log exceptions in log file
            }
        }

        // This function posts production data to the database given a date, location, and JSON string
        public bool postProductionData(DateTime date, int locationID, string data)
        {
            JArray dataJSON = JArray.Parse(data);
            IEnumerable<ProductionData> productionData = _context.ProductionData.ToList();
            IEnumerable<SqlFormulas> sqlFormulas = _context.SqlFormulas.ToList();

            string statementToExecute = "DECLARE @query nvarchar(max); DECLARE @Date datetime; DECLARE @MetricID int; DECLARE @Location int;";
            foreach (var record in dataJSON)
            {
                var recordProperties = record.Children<JProperty>();

                ProductionData row = 
                    (from prodData in productionData
                     where prodData.Id == (int)recordProperties.FirstOrDefault(x => x.Name == "ID").Value
                     select prodData).SingleOrDefault();


                row.Plan = (double?)recordProperties.FirstOrDefault(x => x.Name == "Plan").Value;
                row.Day = (double?)recordProperties.FirstOrDefault(x => x.Name == "Day").Value;
                row.Mtd = (double?)recordProperties.FirstOrDefault(x => x.Name == "Mtd").Value;
                row.Ytd = (double?)recordProperties.FirstOrDefault(x => x.Name == "Ytd").Value;
                row.Comments = (string)recordProperties.FirstOrDefault(x => x.Name == "Comments").Value;

                _context.SetModified(row);

                int metricID = (int)recordProperties.FirstOrDefault(x => x.Name == "MetricID").Value;
                var query =
                    (from formulas in sqlFormulas
                    where formulas.MetricId == metricID
                    select formulas.Query).ToList();


                if (date.Date < DateTime.Now.Date) { 
                    for (var day = date.Date; day.Date < DateTime.Now.Date; day = day.AddDays(1))
                    {
                        createRecords(day, locationID);
                        for (int i = 0; i < query.Count; i++)
                        {
                            statementToExecute = String.Concat(statementToExecute, "SET @query= \'" + query[i].ToString() + ";\' SET @Date= \'" + day + "\'SET @MetricID= \'" + metricID +
                                "\'SET @Location= \'" + locationID + "\' EXEC sp_executesql @query, N\'@Date datetime, @MetricID int, @Location int\', @Date, @MetricID, @Location; ");
                        }
                    }
                } else
                {
                    for (int i = 0; i < query.Count; i++)
                    {
                        statementToExecute = String.Concat(statementToExecute, "SET @query= \'" + query[i].ToString() + ";\' SET @Date= \'" + date.Date + "\'SET @MetricID= \'" + metricID +
                            "\'SET @Location= \'" + locationID + "\' EXEC sp_executesql @query, N\'@Date datetime, @MetricID int, @Location int\', @Date, @MetricID, @Location; ");
                    }
                }


            }

            // Submit the database context
            try
            {
                //Save changes and calculate
                _context.SaveChanges();
                _context.ExecuteSqlCommand(statementToExecute);

                // Create a record to log in calculation_log table
                CalculationLog calcRecord = new CalculationLog { LocationsId = locationID };
                _context.CalculationLog.Add(calcRecord);
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                Console.WriteLine(e); // TODO: log exceptions in log file
            }

            return true;
        }

        public string getProductionData(DateTime fromDate, DateTime toDate, int location)
        {

            for (var day = fromDate.Date; day.Date <= toDate.Date; day = day.AddDays(1))
            {
                createRecords(day, location);
            }

            IEnumerable<Metrics> metrics = _context.Metrics.ToList();
            IEnumerable<ProductionData> productionData = _context.ProductionData.ToList();
            IEnumerable<MetricsAvailability> metricsAvailability = _context.MetricsAvailability.ToList();
            IEnumerable<Locations> locations = _context.Locations.ToList();
            IEnumerable<MetricsGroup> metricsGroup = _context.MetricsGroup.ToList();
            IEnumerable<MetricsDataType> metricsDataType = _context.MetricsDataType.ToList();

            // query production data
            var dataOutput = from prodData in productionData
                             join m in metrics on prodData.MetricsId equals m.Id
                             join metricAvail in metricsAvailability
                             on new { prodData.LocationsId, prodData.MetricsId } equals new { metricAvail.LocationsId, metricAvail.MetricsId }
                             join mGroup in metricsGroup on m.MetricsGroupId equals mGroup.Id
                             join mDataType in metricsDataType on m.MetricsDataType equals mDataType.Id
                             join locationTable in locations on prodData.LocationsId equals locationTable.Id
                             where prodData.LocationsId == location && (prodData.Date >= fromDate.Date && prodData.Date <= toDate.Date)
                             orderby prodData.Date ascending, mGroup.Id ascending, m.Name ascending
                             select new
                             {
                                 ID = prodData.Id,
                                 MetricID = m.Id,
                                 Date = prodData.Date,
                                 MetricName = m.Name,
                                 MetricGroup = mGroup.GroupName,
                                 MetricsDataType = mDataType.Type,
                                 Plan = prodData.Plan,
                                 Day = prodData.Day,
                                 Mtd = prodData.Mtd,
                                 Ytd = prodData.Ytd,
                                 DayValueActionType = m.DayValueActionType,
                                 PlanValueActionType = m.PlanValueActionType,
                                 MtdValueActionType = m.MtdValueActionType,
                                 YtdValueActionType = m.YtdValueActionType,
                                 Comments = prodData.Comments,
                                 Location = locationTable.Name
                             };

            string json = JsonConvert.SerializeObject(dataOutput);
            return json;
        }
    }
}
