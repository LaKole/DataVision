using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AntivirusAnalytics.Models
{
    public class History
    {
        public int HistoryID { get; set; }
        public int UserID { get; set; }
        public DateTime CreateDate { get; set; }
        public string ImagePath { get; set; }
    }
}