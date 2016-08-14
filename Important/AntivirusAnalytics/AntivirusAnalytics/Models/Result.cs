using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace AntivirusAnalytics.Models
{
    public class Result
    {

        public int ID { get; set; }
        public string Antivirus { get; set; }
        public string MD5 { get; set; }
        public DateTime ScanDate { get; set; }
        public string Version { get; set; }
        public int Detection { get; set; }

    }


}

