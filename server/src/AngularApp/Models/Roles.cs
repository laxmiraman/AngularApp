using System;
using System.Collections.Generic;

namespace PACCAR_App.Models
{
    public partial class Roles
    {
        public Roles()
        {
            Users = new HashSet<Users>();
        }

        public int Id { get; set; }
        public string Role { get; set; }

        public virtual ICollection<Users> Users { get; set; }
    }
}
