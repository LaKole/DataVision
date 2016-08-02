using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace AntiVirusAnalysisTool.Models
{
    public class AnalysisResult
    {
        //public int ID { get; set; }
        //public string Antivirus { get; set; }
        //public DateTime ScanDate { get; set; }
        //public int countMD5 { get; set; }
        //public int countDFAVR { get; set; }
        //public int countDFMW { get; set; }

        public int ID { get; set; }
        public string Antivirus { get; set; }
        public DateTime ScanDate { get; set; }
        public string MD5 { get; set; }
        public float DetectionFailureAVR { get; set; }
        public string SignatureLabelAVR { get; set; }
        public float DetectionFailureMalware { get; set; }
        public string SignatureLabelMalware { get; set; }
    }

    public class AnalysisResultContext : DbContext
    {
        public AnalysisResultContext()
            : base("AnalysisResultContext")
        {
        }

        public DbSet<AnalysisResult> AnalysisResults { get; set; }
    }
}