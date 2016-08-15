using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic;
using System.Web;
using System.Web.Mvc;

namespace AntiVirusAnalysisTool.Controllers
{
    public class HomeController : Controller
    {

        public ActionResult Index()
        {
            return View();
        }
        public ActionResult GetPartialView(string tab)
        {
            switch (tab)
            {
                case "h1":
                    return PartialView("_home");
                case "c1":
                    return PartialView("_comparison");
                case "c2":
                    return PartialView("_composition");
                case "c3":
                    return PartialView("_relationship");
                case "c4":
                    return PartialView("_table");
                case "c5":
                    return PartialView("_trend");
            }

            return View("Index");
        }


        public ActionResult testing()
        {
            return View();
        }



























        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}