using System.Net;
using System.Web;
using System.Web.Mvc;

namespace Woju.Helpers
{
    public static class HtmlHelpers
    {
        public static MvcHtmlString LoadHtml(this HtmlHelper html, string file)
        {
            //import html content (file)
            string rawHtml = new WebClient().DownloadString(HttpContext.Current.Server.MapPath(file)).ToString();

            //change CSS class to make it compatible with Bootstrap
            rawHtml = rawHtml.Replace("dataframe", "\'table table-striped table-bordered table-condensed table-hover\'");

            //find the beginning of the inner table and get the portion of the imported content from that position to the end
            int startIdx = rawHtml.IndexOf("<table b");
            rawHtml = rawHtml.Substring(startIdx);

            //find the end of the inner table and remove the tale after the end
            int endIdx = rawHtml.IndexOf("</table") + "</table>".Length;
            string innerTbl = rawHtml.Substring(0, endIdx);

            //return the inner html table to the view
            return MvcHtmlString.Create(innerTbl);
        }
    }
}