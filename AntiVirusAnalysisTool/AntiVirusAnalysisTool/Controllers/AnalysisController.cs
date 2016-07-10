using AntiVirusAnalysisTool.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AntiVirusAnalysisTool.Controllers
{
    public class AnalysisController : Controller
    {
        private AnalysisResultContext db = new AnalysisResultContext();


        public ActionResult Index()
        {
            return View();
        }

        public ActionResult getData()
        {
            List<AnalysisResult> arl = new List<AnalysisResult>();


            var v = (from a in db.AnalysisResults
                     group a by a.Antivirus into av
                     select new
                     {
                         anv = av.Key,
                         cm = av.Count(),
                         cdfavr = av.Count(x => x.DetectionFailureAVR == 1),
                         cdfmw = av.Count(x => x.DetectionFailureMalware == 1)
                     }
                     );

            return Json(v, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Chart()
        {
            return View();
        }

    }
}