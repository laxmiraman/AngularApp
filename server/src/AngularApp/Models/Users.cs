using System;
using System.Collections.Generic;

namespace PACCAR_App.Models
{
    public partial class Users
    {
        public Users()
        {
            UsersLocations = new HashSet<UsersLocations>();
        }

        public int Id { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public int? RolesId { get; set; }

        public virtual ICollection<UsersLocations> UsersLocations { get; set; }
        public virtual Roles Roles { get; set; }
    }
}
