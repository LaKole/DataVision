using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AVAT.Models
{
    public class ScanResultModel
    {
        public List<ScanResult> findAll() 
        {
            return new List<ScanResult> {
                new ScanResult{
                    ID = 1,
                    Antivirus = "Microsoft",
                    MD5 = "md590",
                    Quantity = 3
                },
                new ScanResult{
                    ID = 2,
                    Antivirus = "McAfee",
                    MD5 = "md5467",
                    Quantity = 17
                },
                new ScanResult{
                    ID = 3,
                    Antivirus = "AVG",
                    MD5 = "md5342",
                    Quantity = 10
                }
            };
        }
    }
}