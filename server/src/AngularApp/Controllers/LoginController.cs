using System;
using Microsoft.AspNetCore.Mvc;

namespace AngularApp.Controllers
{
    [Route("api/[controller]")]
    [EnableCors("CorsPolicy")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]

    public class LoginController : Controller
    {
       
        private LoginService loginService;

        public LoginController(IContext context)
        {
            _context = context;
            loginService = new LoginService(_context);
        }
        
        // GET: api/users
        /// <summary>
        /// Gets Users Information.
        /// </summary>
        /// <response code="200">Users are retrieved from the system</response>
        /// <response code="400">Bad Request</response>
        [HttpGet("Users")]
        public IActionResult users()
        {
            try
            {
                var result = loginService.getUsers();
                return Content(result, "application/json");
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
    
        // GET: api/roles
        /// <summary>
        /// Gets roles.
        /// </summary>
        /// <response code="200">Roles are retrieved from the system</response>
        /// <response code="400">Bad Request</response>
        [HttpGet("Roles")]
        public IActionResult roles()
        {
            try
            {
                var result = loginService.getRoles();
                return Content(result, "application/json");
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        // GET: api/Login/{username}/{password}
        /// <summary>
        /// Gets Authenticate
        /// </summary>
        /// <response code="200">Authentication is retrieved from the system</response>
        /// <response code="400">Bad Request</response>
        [HttpGet("{username}/{password}")]
        public IActionResult getAuthenticate(String username, String password)
        {
            try
            {
                var result = loginService.getAuthenticate(username, password);
                return Content(result, "application/json");
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

    }
}
