<html>
<head>
    <title></title>
    <link href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css' rel='stylesheet' integrity='sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u' crossorigin='anonymous'>
    <link href="../../app.css" rel="stylesheet" >
</head>
<body>
    <nav class="navbar navbar-default">
    <div class="container">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="../../index.html"><img class="logo" src="https://www.docker.com/sites/all/themes/docker/assets/images/brand-full.svg" alt="Docker" title="Docker"/></a>
        </div>
    </div><!-- /.container-fluid -->
    </nav>
    <div class="container">
    <div class="row">
        <h1></h1>
        <div class="content">
            <h1 id="inspection-commands">Inspection Commands</h1>
<h2 id="inspecting-system-information">Inspecting System Information</h2>
<ol>
<li><p>We can find the <code>info</code> command under <code>system</code>. Execute:</p>
<pre><code class="lang-bash">$ docker system info
</code></pre>
</li>
<li><p>From the output of the last command, identify:</p>
<ul>
<li>how many images are cached on your machine?</li>
<li>how many containers are running or stopped?</li>
<li>what version of containerd are you running?</li>
<li>whether Docker is running in swarm mode?</li>
</ul>
</li>
</ol>
<h2 id="monitoring-system-events">Monitoring System Events</h2>
<ol>
<li><p>There is another powerful system command that allows us to monitor what&#39;s happening on the Docker host. Execute the following command:</p>
<pre><code class="lang-bash">$ docker system events
</code></pre>
<p>Please note that it looks like the system is hanging, but that is not the case. The system is just waiting for some events to happen.</p>
</li>
<li><p>Open a second terminal and execute the following command:</p>
<pre><code class="lang-bash">$ docker container run --rm alpine echo &#39;Hello World!&#39;
</code></pre>
<p>and observe the generated output in the first terminal. It should look similar to this:</p>
<pre><code class="lang-bash">2017-01-25T16:57:48.553596179-06:00 container create 30eb63 ...
2017-01-25T16:57:48.556718161-06:00 container attach 30eb63 ...
2017-01-25T16:57:48.698190608-06:00 network connect de1b2b ...
2017-01-25T16:57:49.062631155-06:00 container start 30eb63 ...
2017-01-25T16:57:49.065552570-06:00 container resize 30eb63 ...
2017-01-25T16:57:49.164526268-06:00 container die 30eb63 ...
2017-01-25T16:57:49.613422740-06:00 network disconnect de1b2b ...
2017-01-25T16:57:49.815845051-06:00 container destroy 30eb63 ...
</code></pre>
</li>
<li><p>If you don&#39;t like the format of the output then we can use the <code>--format</code> parameter to define our own format in the form of a <a href="https://golang.org/pkg/text/template/">Go template</a>. Stop the events watch on your first terminal with <code>CTRL+C</code>, and try this:</p>
<pre><code class="lang-bash">$ docker system events --format &#39;--&gt; {{.Type}}-{{.Action}}&#39;
</code></pre>
<p>now the output looks a little bit less cluttered when we run our alpine container on the second terminal as above.</p>
</li>
<li><p>Finally we can find out what the event structure looks like by outputting the events in <code>json</code> format (once again after killing the events watcher on the first terminal and restarting it with):</p>
<pre><code class="lang-bash">$ docker system events --format &#39;{{json .}}&#39; | jq
</code></pre>
<p>which should give us for the first event in the series after re-running our alpine container on the second node something like this (note, the output has been prettyfied for readability):</p>
<pre><code class="lang-json">TODO: replace with Windows version
{
   &quot;status&quot;:&quot;create&quot;,
   &quot;id&quot;:&quot;95ddb6ed4c87d67fa98c3e63397e573a23786046e00c2c68a5bcb9df4c17635c&quot;,
   &quot;from&quot;:&quot;alpine&quot;,
   &quot;Type&quot;:&quot;container&quot;,
   &quot;Action&quot;:&quot;create&quot;,
   &quot;Actor&quot;:{
      &quot;ID&quot;:&quot;95ddb6ed4c87d67fa98c3e63397e573a23786046e00c2c68a5bcb9df4c17635c&quot;,
      &quot;Attributes&quot;:{
         &quot;image&quot;:&quot;alpine&quot;,
         &quot;name&quot;:&quot;sleepy_roentgen&quot;
      }
   },
   &quot;time&quot;:1485385702,
   &quot;timeNano&quot;:1485385702748011034
}
</code></pre>
</li>
</ol>
<h2 id="conclusion">Conclusion</h2>
<p>In this exercise we have learned how to inspect system wide properties of our Docker host by using the <code>docker system info</code> command; this is one of the first places to look for general config information to include in a bug report. We also saw a simple example of <code>docker system events</code>; the events stream is one of the primary sources of information that should be logged and monitored when running Docker in production. Many commercial as well as open source products (such as Elastic Stack) exist to facilitate aggregating and mining these streams at scale.</p>

        </div>        
    </div>
    <div class="row">
        <ul class="mt-article-pagination" style="display:block;">
        </ul>
    </div>
</div>
    <div class="footer"></div>
</body>