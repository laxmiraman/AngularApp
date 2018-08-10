using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace AngularApp.Services
{
    public class LoginService
    {
        IPACCARContext _context;

        public LoginService(IPACCARContext context)
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
                             join u in users on userLoc.UsersId equals u.Id
                             join role in roles on u.RolesId equals role.Id                             
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

        private String buildAuthenticateData(String authenticationData)
        {
             JObject output = new JObject();

             JArray authenticationDataArray = JArray.Parse(authenticationData);
             JArray Locations = new JArray();

            foreach (JObject data in authenticationDataArray)
            {
                Locations.Add(data["LocationId"]);
                Locations.Add(data["LocationName"]);
            }

                 output.Add("UserLocationId", authenticationDataArray[0]["UserLocationId"]);
                 output.Add("UserId", authenticationDataArray[0]["UserId"]);
                 output.Add("UserName", authenticationDataArray[0]["UserName"]);
                 output.Add("Password", authenticationDataArray[0]["Password"]);
                 output.Add("RoleId", authenticationDataArray[0]["RoleId"]);
                 output.Add("RoleName", authenticationDataArray[0]["RoleName"]);
                 output.Add("Locations", Locations);
                     
            return JsonConvert.SerializeObject(output);
        }
      }
    }

