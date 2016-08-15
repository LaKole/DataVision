using AntivirusAnalytics.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace AntivirusAnalytics.Controllers
{
    public class UserController : Controller
    {
        AntivirusAnalyticsDB db = new AntivirusAnalyticsDB();
        
        [HttpPost]
        public string SignIn(User user)
        {
            if (ModelState.IsValid)
            {
                if (user.Validate(user))
                {
                    FormsAuthentication.SetAuthCookie(user.Email, user.RememberMe);
                    return "Logged in";

                }
                else { return "Incorrect email or password"; }
            }
            else
            {
                return "Incomplete form";
            }

        }

        [HttpPost]
        public string Register(User user)
        {
            if (ModelState.IsValid)
            {
                if (user.Register(user))
                {
                    FormsAuthentication.SetAuthCookie(user.Email, user.RememberMe);
                    return "Registered";
                }
                else { return "User already exists, please log in"; }
            }
            else { return "Incomplete form"; }

        }
        
        [HttpPost]
        public string SignOut()
        {
            FormsAuthentication.SignOut();
            return "Logged Out";
        }

        [HttpPost]
        public ActionResult History()
        {
            if (User.Identity.IsAuthenticated)
            {

                User user = new User();
                user = GetUserByEmail(User.Identity.Name);
                List<History> userHistory = new List<History>();
                userHistory = GetUserHistory(user.ID);
                return PartialView("../Home/History", userHistory);
            }
            else { return View("../Home/Index"); }
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

        public List<History> GetUserHistory(int userId)
        {
            try
            {
                List<History> histories = db.HistoryRepository.Where(x => x.UserID == userId).ToList();
                return histories;

            }
            catch { throw; }
        }

        [HttpPost]
        public string DeleteHistory(int id)
        {
            History history = db.HistoryRepository.Find(id);
            db.HistoryRepository.Remove(history);
            db.SaveChanges();
            return "Deleted";

        }
    }
}