using System;
using System.Collections.Generic;

namespace PACCAR_App.Models
{
    public partial class ProductionData
    {
        public int Id { get; set; }
        public int? MetricsId { get; set; }
        public int? LocationsId { get; set; }
        public double? Plan { get; set; }
        public double? Day { get; set; }
        public double? Mtd { get; set; }
        public double? Ytd { get; set; }
        public DateTime Date { get; set; }
        public string Comments { get; set; }
        public DateTime? CreatedDatetime { get; set; }
        public DateTime? ModifiedDatetime { get; set; }

        public virtual Locations Locations { get; set; }
        public virtual Metrics Metrics { get; set; }
    }
}
