using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using Microsoft.EntityFrameworkCore;

namespace Angular_App.Services
{
    public class ProductionDataService
    {
        IContext _context; // db context

        public ProductionDataService(IContext context)
        {
            _context = context;
        }

        // This function gets the production data values given a date and location
        public string getProductionData(DateTime date, int locationID)
        {

            // create records that do note exist
            createRecords(date, locationID);

            IEnumerable<ProductionData> productionData = _context.ProductionData.ToList();



            var dataOutput = from prodData in productionData
                             on new { prodData.LocationsId, prodData.MetricsId } equals new { metricAvail.LocationsId, metricAvail.MetricsId }
                             join location in locations on prodData.LocationsId equals location.Id
                             select new
                             {
                                 ID = prodData.Id,
                                 MetricID = m.Id,
                                 Date = prodData.Date,
                                 MetricName = m.Name,
                                 Day = prodData.Day,
                                 DayValueActionType = m.DayValueActionType,
                                 Comments = prodData.Comments,
                             };


            string json = JsonConvert.SerializeObject(dataOutput);
            return json;
        }

        // Creates records if records do not exist in database
        public void createRecords(DateTime date, int locationID)
        {
            IEnumerable<ProductionData> productionData = _context.ProductionData.ToList();


            var dataToCreate = (from metricsAvail in metricsAvailability
  
                                select metricsAvail.MetricsId)
                                       .Except(
                                                from prodData in productionData
                                                select prodData.MetricsId
                                              ).ToList();

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

       

        
    }
}
