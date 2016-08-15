using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace AntivirusAnalytics.Models
{
    public class History
    {
        [Key]
        public int ID { get; set; }

        public int UserID { get; set; }
        public string Query { get; set; }
        public DateTime CreateDate { get; set; }


        public static AntivirusAnalyticsDB db = new AntivirusAnalyticsDB();

        public static void SaveHistory(History history)
        {
            try
            {
            db.HistoryRepository.Add(history);
            db.SaveChanges();

            }
            catch { throw; }
        }

        

        public static History GetHistoryById(int histId)
        {
            try
            {
            History history = db.HistoryRepository.Where(x => x.ID == histId).FirstOrDefault();
            return history;

            }
            catch { throw; }
        }




    }
}