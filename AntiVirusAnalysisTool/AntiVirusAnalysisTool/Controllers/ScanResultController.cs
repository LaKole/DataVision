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
        private ScanResultContext db = new ScanResultContext();

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

        public ActionResult List()
        {
            List<ScanResult> result = new List<ScanResult>();
            result = db.ScanResults.Take(5).ToList();
            return View(result);
        }

        public ActionResult Chart()
        {
            return View(db.ScanResults.Take(5).ToList());
        }

        public ActionResult QueryBuilder()
        {
            List<ScanResult> results = new List<ScanResult>();

            

            return View();
        }
    }
}