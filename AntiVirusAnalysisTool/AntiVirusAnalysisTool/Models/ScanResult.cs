using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace AntiVirusAnalysisTool.Models
{
    public class ScanResult
    {

        //public int ID { get; set; }
        public string Antivirus { get; set; }
        public DateTime ScanDate { get; set; }
        public string MD5 { get; set; }
        public int DetectionFailureAVR { get; set; }
        public string SignatureLabelAVR { get; set; }
        public int DetectionFailureMalware { get; set; }
        public string SignatureLabelMalware { get; set; }
        
        
    }





















    public class ScanResultX{

        public int ID { get; set; }
        public string Antivirus { get; set; }
        public int Quantity { get; set; }
        public string MD5 { get; set; }

        public List<ScanResultX> findAll()
        {
            return new List<ScanResultX> {
                new ScanResultX{
                    ID = 1,
                    Antivirus = "Microsoft",
                    MD5 = "md590",
                    Quantity = 3
                },
                new ScanResultX{
                    ID = 2,
                    Antivirus = "McAfee",
                    MD5 = "md5467",
                    Quantity = 17
                },
                new ScanResultX{
                    ID = 3,
                    Antivirus = "AVG",
                    MD5 = "md5342",
                    Quantity = 10
                }
            };
        }
    }

    public class ScanResultContext : DbContext
    {
        public ScanResultContext()
            : base("ScanResultContext")
        { 
        }

        public DbSet<ScanResult> ScanResults { get; set; }

    }
}