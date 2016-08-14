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
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js",
                        "~/Scripts/jquery-ui-{version}.js",
                        "~/js/external/jquery.multiselect.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/helpers")
                      .IncludeDirectory("~/js/external", "*.js", true));


            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.min.js"));

            bundles.Add(new StyleBundle("~/Content").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css",
                      "~/Content/userPanel.css",
                      "~/Content/jquery.multiselect.css")
                      .IncludeDirectory("~/Content/themes/base", "*.css"));
        }
    }
}