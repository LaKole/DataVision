using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Optimization;

namespace AntivirusAnalytics.App_Start
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
           

            bundles.Add(new StyleBundle("~/webstyles").Include(
                      "~/Content/css/pt-sans.css",
                      "~/Content/css/reset.css",
                      "~/Content/css/style.css"));

            bundles.Add(new StyleBundle("~/otherstyles")
                      .IncludeDirectory("~/Content/themes", "*.css", true));



            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
             "~/Scripts/jquery-{version}.js",
             "~/Scripts/jquery-ui-{version}.js",
             "~/Scripts/jquery.multiselect.min.js",
             "~/Scripts/jquery.progress.Timer.js",
             "~/Scripts/loader.js",
             "~/Scripts/modernizr.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.min.js"));





        }
    }
}