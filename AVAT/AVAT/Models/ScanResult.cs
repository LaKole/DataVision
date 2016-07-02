using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AVAT.Models
{
    public class ScanResult
    {
        //non nullables
        //criteria will be label, has to be one of the SR attributes
        //quantity will be quantifier
        public string Criteria { get; set; }
        public int Quantity { get; set; }

        //nullables, other details passed 
        public int ID { get; set; }
        public string Antivirus { get; set; }
        public DateTime ScanDate { get; set; }
        public string MD5 { get; set; }
        //public int DetectionFailureAVR { get; set; }
        public string SignatureLabelAVR { get; set; }
        //public int DetectionFailureMalware { get; set; }
        public string SignatureLabelMalware { get; set; }

    }
}