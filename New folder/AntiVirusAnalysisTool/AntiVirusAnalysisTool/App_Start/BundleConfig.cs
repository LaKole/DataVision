using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Optimization;

namespace AntiVirusAnalysisTool
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js",
                        "~/Scripts/jquery-ui-{version}.js",
                        "~/Scripts/helpers/jquery.multiselect.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/helpers").Include(
                        //"~/Scripts/helpers/loader.js",
                        "~/Scripts/helpers/chart.js",
                        "~/Scripts/helpers/selection.js",
                        "~/Scripts/helpers/pageSetup.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css",
                      "~/Content/jquery.multiselect.css")
                      .IncludeDirectory("~/Content/themes/base", "*.css"));
        }
    }
}