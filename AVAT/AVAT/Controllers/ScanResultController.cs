using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AVAT.Models;

namespace AVAT.Controllers
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
            ScanResultModel srm = new ScanResultModel();
            return Json(srm.findAll(), JsonRequestBehavior.AllowGet);
        }
    }
}