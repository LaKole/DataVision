using AntiVirusAnalysisTool.Models;
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
            double detectionState = 0;

            if (d == "Failure") { detectionState = 1; }

            if (q == "Count")
            {


                var vx = (from a in db.AnalysisResults
                          group a by a.Antivirus into av
                          select new
                          {
                              anv = av.Key,
                              cm = av.Count(),
                              cdfavr = av.Count(x => x.DetectionFailureAVR == detectionState),
                              cdfmw = av.Count(x => x.DetectionFailureMalware == detectionState)
                          }
                         );

                return Json(vx, JsonRequestBehavior.AllowGet);


            }
            else
            {

                var rate = (from a in db.AnalysisResults
                            group a by a.Antivirus into av
                            select new
                            {
                                anv = av.Key,
                                cdfavr = (double)av.Count(x => x.DetectionFailureAVR == detectionState) / av.Count(),
                                cdfmw = (double)av.Count(x => x.DetectionFailureMalware == detectionState) / av.Count()
                            }
            );
                return Json(rate, JsonRequestBehavior.AllowGet);

            }


        }

        [HttpPost]
        public ActionResult LoadTableData(string dr)
        {
            DateTime sd = Convert.ToDateTime(dr);

            //jQuery DataTables Param
            var draw = Request.Form.GetValues("draw").FirstOrDefault();
            //Find paging info
            var start = Request.Form.GetValues("start").FirstOrDefault();
            var length = Request.Form.GetValues("length").FirstOrDefault();
            //Find order columns info
            var sortColumn = Request.Form.GetValues("columns[" + Request.Form.GetValues("order[0][column]").FirstOrDefault()
                                    + "][name]").FirstOrDefault();
            var sortColumnDir = Request.Form.GetValues("order[0][dir]").FirstOrDefault();
            //find search columns info
            var antivirus = Request.Form.GetValues("columns[0][search][value]").FirstOrDefault();
            var scandate = Request.Form.GetValues("columns[2][search][value]").FirstOrDefault();
            var dfAVR = Request.Form.GetValues("columns[3][search][value]").FirstOrDefault();


            int pageSize = length != null ? Convert.ToInt32(length) : 0;
            int skip = start != null ? Convert.ToInt16(start) : 0;
            int recordsTotal = 0;


            var v = (from a in db.AnalysisResults
                     select a);

            //searching...
            if (!string.IsNullOrEmpty(antivirus))
            {
                v = v.Where(a => a.Antivirus == antivirus);
            }

            if (!string.IsNullOrEmpty(scandate))
            {
                DateTime dt = Convert.ToDateTime(scandate);
                v = v.Where(a => a.ScanDate == dt);
            }

            if (!string.IsNullOrEmpty(dfAVR))
            {
                int x = 0;
                if (dfAVR == "True") { x = 1; }
                v = v.Where(a => a.DetectionFailureAVR == x);
            }

            //sorting...
            if (!(string.IsNullOrEmpty(sortColumn) && string.IsNullOrEmpty(sortColumnDir)))
            {
                v = v.OrderBy(sortColumn + " " + sortColumnDir);
            }
            ;
            recordsTotal = v.Count();
            var data = v.Skip(skip).Take(pageSize).ToList();
            //Data(CData(v));
            return Json(new { draw = draw, recordsFiltered = recordsTotal, recordsTotal = recordsTotal, data = data }, JsonRequestBehavior.AllowGet);

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