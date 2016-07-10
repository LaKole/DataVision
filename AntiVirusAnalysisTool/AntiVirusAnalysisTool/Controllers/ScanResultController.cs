using AntiVirusAnalysisTool.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AntiVirusAnalysisTool.Controllers
{
    public class ScanResultController : Controller
    {

        // GET: ScanResult
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Data()
        {
            ScanResultX  srl = new ScanResultX();
            return Json(srl.findAll(), JsonRequestBehavior.AllowGet);
        }

    }
}