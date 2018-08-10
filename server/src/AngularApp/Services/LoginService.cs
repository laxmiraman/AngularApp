using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace AngularApp.Services
{
    public class LoginService
    {
        IContext _context;

        public LoginService(IContext context)
        {
            _context = context;

        }

        // This function gets Roles list
        public String getRoles()
        {
            IEnumerable<Roles> roles = _context.Roles.ToList();

            var rolesList = from role in roles
                            select new
                            {
                                role.Id,
                                role.Role
                            };

            String json = JsonConvert.SerializeObject(rolesList);
            return json;
        }

        // This function gets Users list
        public String getUsers()
        {
            IEnumerable<Users> users = _context.Users.ToList();
            IEnumerable<Roles> roles = _context.Roles.ToList();

            var usersList = from u in users
                            join r in roles on u.RolesId equals r.Id
                            select new
                            {
                                UserName = u.UserName,
                                Password = u.Password,
                                Role = r.Role
                            };

            String json = JsonConvert.SerializeObject(usersList);
            return json;
        }

        //This function gets the authentication data(users, roles, location)
        public String getAuthenticate(String username, String password)
        {

            IEnumerable<UsersLocations> userlocations = _context.UsersLocations.ToList();
            IEnumerable<Users> users = _context.Users.ToList();
            IEnumerable<Roles> roles = _context.Roles.ToList();
            IEnumerable<Locations> locations = _context.Locations.ToList();

            var dataOutput = from userLoc in userlocations
                             join l in locations on userLoc.LocationsId equals l.Id                      
                             where u.UserName == username & u.Password == password
                        
                               select new
                            {
                                 UserLocationId = userLoc.Id,
                                 LocationId = l.Id,
                                 LocationName=l.Name,                        
                                 UserId = u.Id,
                                 UserName = u.UserName,
                                 Password = u.Password,
                                 RoleId = role.Id,
                                 RoleName = role.Role

                             };
      //      string authenticatejson = JsonConvert.SerializeObject(dataOutput);
          String json = JsonConvert.SerializeObject(dataOutput);
        //    String json = buildAuthenticateData(authenticatejson);
            return json;
        }

        
      }
    }

