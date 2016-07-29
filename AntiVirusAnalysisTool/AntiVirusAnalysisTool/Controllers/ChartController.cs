using AntiVirusAnalysisTool.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Linq.Dynamic;
using System.Collections;

namespace AntiVirusAnalysisTool.Controllers
{
    public class ChartController : Controller
    {
        private ScanResultContext db = new ScanResultContext();
        private AnalysisResultContext dbx = new AnalysisResultContext();

        public ActionResult test()
        {

            var data = dbx.AnalysisResults.Take(5).ToList();

            return Json(data, JsonRequestBehavior.AllowGet);
        }
       


        // GET: ScanResult
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Data()//(IEnumerable data)
        {
            ScanResultX srl = new ScanResultX();
            return Json(srl.findAll(), JsonRequestBehavior.AllowGet);
            
            //return Json(data, JsonRequestBehavior.AllowGet);
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


        [HttpPost]
        public ActionResult LoadData(string dr)
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


            var v = (from a in db.ScanResults
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

        class ChartData
        {
            public string Antivirus { get; set; }
            public int Quantity { get; set; }
        }

        public IEnumerable CData(IQueryable<ScanResult> data)
        {
            
            var x = from d in data
                    group d by d.Antivirus into g
                    select new ChartData { Antivirus = g.Key, Quantity = g.Count() };

            return x.AsEnumerable();
        
        }
    }
}