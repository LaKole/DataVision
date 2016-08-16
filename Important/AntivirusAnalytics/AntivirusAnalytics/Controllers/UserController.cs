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

    }
}