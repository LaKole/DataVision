using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Woju.Controllers
{
    public class VisualController : Controller
    {
        // GET: Visual
        
        //visualisation logic here - eg R scripts handling
        //method to run RHTML code and print output to ~/Content
        //pass in html script name to view and display

        public ActionResult BarChart()
        {
            @ViewBag.Path = "~/Content/R_HTML/maryland_Mw_Date_AvCounter.html";
            return View();
        }

        public ActionResult Graph()
        {
            @ViewBag.Path = "~/Content/R_HTML/maryland_Mw_Date_AvCounter.html";
            return View();
        }

        public ActionResult Table()
        {
            @ViewBag.Path = "~/Content/R_HTML/maryland_Mw_Date_AvCounter.html";
            return View();
        }
    }
}