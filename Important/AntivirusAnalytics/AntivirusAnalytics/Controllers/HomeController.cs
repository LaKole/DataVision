using AntivirusAnalytics.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;



namespace AntivirusAnalytics.Controllers
{
    public class HomeController : Controller
    {

        AntivirusAnalyticsDB db = new AntivirusAnalyticsDB();

        // GET: Home
        public ActionResult Index()
        {
            return View();
        }


        [HttpPost]
        public ActionResult History()
        {
            if (User.Identity.IsAuthenticated)
            {

                User user = new User();
                user = GetUserByEmail(User.Identity.Name);
                List<History> userHistory = new List<History>();
                userHistory = GetHistoryByUser(user.ID).OrderByDescending(i => i.CreateDate).ToList();
                return PartialView("History", userHistory);
            }
            else { return View("Index"); }
        }

        public List<History> GetHistoryByUser(int userId)
        {
            try
            {
                List<History> histories = db.HistoryRepository.Where(x => x.UserID == userId).ToList();
                return histories;

            }
            catch { throw; }
        }

        public User GetUserByEmail(string email)
        {
            try
            {
                var tUser = db.Users.Where(u => u.Email.Equals(email)).FirstOrDefault();
                return tUser;
            }
            catch { throw; }
        }

        [HttpPost]
        public String DeleteHistory(int id)
        {
            try
            {
                History history = db.HistoryRepository.Find(id);
                db.HistoryRepository.Remove(history);
                db.SaveChanges();
                return "Deleted";
            }
            catch { throw; }

        }

        public String GetRegenerateOptions(int id)
        {
            try
            {
                History history = db.HistoryRepository.Find(id);
                string options = history.Query + "?" + history.ChartType;
                return options;
            }
            catch { throw; }

        }
    }
}