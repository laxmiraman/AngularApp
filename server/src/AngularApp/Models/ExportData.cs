using System;
using System.Collections.Generic;

namespace PACCAR_App.Models
{

    public class ExportModel
    {
        public int Id { get; set; }
        public int MetricId { get; set; }
        public DateTime Date { get; set; }
        public string MetricName { get; set; }
        public float? Plan { get; set; }
        public float? Day { get; set; }
        public string Comments { get; set; }
        public string Location { get; set; }
    }
}