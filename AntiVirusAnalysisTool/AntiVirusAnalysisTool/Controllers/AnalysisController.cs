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

        [HttpPost]
        public ActionResult getData(string q, string d, string v, string g)
        {

            if (q == "Count")
            {
                if (d == "Failure")
                {

                    var vx = (from a in db.AnalysisResults
                              group a by a.Antivirus into av
                              select new
                              {
                                  anv = av.Key,
                                  cm = av.Count(),
                                  cdfavr = av.Count(x => x.DetectionFailureAVR == 1),
                                  cdfmw = av.Count(x => x.DetectionFailureMalware == 1)
                              }
                             );
                    return Json(vx, JsonRequestBehavior.AllowGet);
                }
                else
                {

                    var vx = (from a in db.AnalysisResults
                              group a by a.Antivirus into av
                              select new
                              {
                                  anv = av.Key,
                                  cm = av.Count(),
                                  cdfavr = av.Count(x => x.DetectionFailureAVR == 0),
                                  cdfmw = av.Count(x => x.DetectionFailureMalware == 0)
                              }
                             );
                    return Json(vx, JsonRequestBehavior.AllowGet);
                }
            
            }
            else
            {
                if (d == "Failure")
                {
                    var rate = (from a in db.AnalysisResults
                                group a by a.Antivirus into av
                                select new
                                {
                                    anv = av.Key,
                                    cdfavr = (double)av.Count(x => x.DetectionFailureAVR == 1) / av.Count(),
                                    cdfmw = (double)av.Count(x => x.DetectionFailureMalware == 1) / av.Count()
                                }
                );
                    return Json(rate, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    var rate = (from a in db.AnalysisResults
                                group a by a.Antivirus into av
                                select new
                                {
                                    anv = av.Key,
                                    cdfavr = (double)av.Count(x => x.DetectionFailureAVR == 0) / av.Count(),
                                    cdfmw = (double)av.Count(x => x.DetectionFailureMalware == 0) / av.Count()
                                }
                );
                    return Json(rate, JsonRequestBehavior.AllowGet);
                }


            
            }


        }

        public ActionResult Chart()
        {
            return View();
        }

    }
}