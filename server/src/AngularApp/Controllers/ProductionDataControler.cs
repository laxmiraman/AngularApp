using System;
using Microsoft.AspNetCore.Mvc;

namespace Angular_App.Controllers
{
    [Route("api/[controller]")]
    [EnableCors("CorsPolicy")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public class ProductionDataController : Controller
    {
        private ProductionDataService productionDataService;
        private BulkInsertService bulkInsertService;
        private ExportService exportService;
        private LoginService loginService;



        public ProductionDataController(IContext context, IHostingEnvironment hostingEnvironment)
        {
            _context = context;
            productionDataService = new ProductionDataService(_context);
            bulkInsertService = new BulkInsertService(_context);
            exportService = new ExportService(_context);
            loginService = new LoginService(_context);
            _hostingEnvironment = hostingEnvironment;
        }

        // POST: /csv
        /// <summary>
        /// Bulk-uploads production data into the system
        /// </summary>
        /// <response code="200">All or some data in the csv is uploaded</response>
        /// <response code="400">Bad request</response>
        [HttpPost("Csv")]
        public async Task<IActionResult> BulkInsert(IFormFile file)
        {
            try
            {
                var reader = new StreamReader(file.OpenReadStream());
                var fileContent = await reader.ReadToEndAsync();
                string[] stringSeparators = new string[] { "\r\n" };
                string[] data = fileContent.Split(stringSeparators, StringSplitOptions.None);
                await bulkInsertService.insertData(data);
                return Ok(200);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }

        // POST: api/ProductionData/{date}/{location}
        /// <summary>
        /// Saves production data.
        /// </summary>
        /// <response code="200">Data for the date is saved.</response>
        /// <response code="400">Parameters are not DateTime and int</response>
        [HttpPost("{date}/{location}")]
        public IActionResult postProductionData(DateTime date, int location)
        {

            try
            {
                Stream req = Request.Body;
                string json = new StreamReader(req).ReadToEnd();
                productionDataService.postProductionData(date, location, json);
                return Ok(200);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }

        }

        // GET: api/ProductionData/{date}/{location}
        /// <summary>
        /// Gets production data given a single Date and Location.
        /// </summary>
        /// <response code="200">Data is retrieved for given parameters</response>
        /// <response code="400">Bad Request</response>
        [HttpGet("{date}/{location}")]
        public IActionResult getProductionData(DateTime date, int location)
        {
            try
            {
                var result = productionDataService.getProductionData(date, location);
                return Content(result, "application/json");
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

}
