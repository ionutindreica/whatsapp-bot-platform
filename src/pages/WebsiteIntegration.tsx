import React from "react";
import BackToDashboard from "@/components/BackToDashboard";

const WebsiteIntegration = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back to Dashboard */}
        <BackToDashboard title="Back to Dashboard" />
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Website Integration
            </h1>
            <p className="text-muted-foreground">Integrate your AI bot into any website with our powerful widget</p>
          </div>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Integration Code</h2>
            <p className="text-muted-foreground mb-4">
              Copy and paste this code into your website's HTML
            </p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <code className="text-sm">
                {`<script>
  (function(w,d,s,o){
    var j=d.createElement(s),f=d.getElementsByTagName(s)[0];
    j.async=1;j.src='https://your-domain.com/widget.js';
    j.setAttribute('data-bot-id', 'your-bot-id');
    f.parentNode.insertBefore(j,f);
  })(window,document,'script');
</script>`}
              </code>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Quick Setup Guide</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <h4 className="font-medium">Copy the integration code</h4>
                  <p className="text-sm text-muted-foreground">Click the copy button above</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <h4 className="font-medium">Paste into your website</h4>
                  <p className="text-sm text-muted-foreground">Add to your HTML before closing &lt;/body&gt; tag</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <h4 className="font-medium">Configure your bot</h4>
                  <p className="text-sm text-muted-foreground">Set up your bot's personality and responses</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  4
                </div>
                <div>
                  <h4 className="font-medium">Test and launch</h4>
                  <p className="text-sm text-muted-foreground">Preview your bot and go live</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* API Documentation */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">API Documentation</h2>
          <p className="text-muted-foreground mb-4">Advanced integration options and API endpoints</p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">REST API</h4>
              <p className="text-sm text-muted-foreground mb-3">Full REST API for custom integrations</p>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600">
                View Docs
              </button>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Webhooks</h4>
              <p className="text-sm text-muted-foreground mb-3">Real-time event notifications</p>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600">
                Configure
              </button>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">SDK</h4>
              <p className="text-sm text-muted-foreground mb-3">JavaScript, Python, PHP SDKs</p>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600">
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteIntegration;