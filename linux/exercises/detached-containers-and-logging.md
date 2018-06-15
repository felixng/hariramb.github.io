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
            <h1 id="detached-containers-and-logging">Detached Containers and Logging</h1>
<h2 id="running-a-container-in-the-background">Running a Container in the Background</h2>
<ol>
<li><p>First try running a container as usual; the STDOUT and STDERR streams from whatever is PID 1 inside the container are directed to the terminal:</p>
<pre><code class="lang-bash">$ docker container run centos:7 ping 127.0.0.1 -c 10
</code></pre>
</li>
<li><p>The same process can be run in the background with the <code>-d</code> flag:</p>
<pre><code class="lang-bash">$ docker container run -d centos:7 ping 127.0.0.1
</code></pre>
</li>
<li><p>Find this second container&#39;s ID, and use it to inspect the logs it generated:</p>
<pre><code class="lang-bash">$ docker container logs &lt;container ID&gt;
</code></pre>
<p>These logs correspond to STDOUT and STDERR from the container&#39;s PID 1.</p>
</li>
</ol>
<h2 id="attaching-to-container-output">Attaching to Container Output</h2>
<ol>
<li><p>We can attach a terminal to a container&#39;s PID 1 output with the <code>attach</code> command; try it with the last container you made in the previous step:</p>
<pre><code class="lang-bash">$ docker container attach &lt;container ID&gt;
</code></pre>
</li>
<li><p>We can leave attached mode by then pressing <code>CTRL+C</code>. After doing so, list your running containers; you should see that the container you attached to has been killed, since the <code>CTRL+C</code> issued killed PID 1 in the container, and therefore the container itself.</p>
</li>
<li><p>Try running the same thing in detached interactive mode:</p>
<pre><code class="lang-bash">$ docker container run -d -it centos:7 ping 127.0.0.1
</code></pre>
</li>
<li><p>Attach to this container like you did the first one, but this time detach with <code>CTRL+P CTRL+Q</code> (sequential, not simultaneous), and list your running containers. In this case, the container should still be happily running in the background after detaching from it.</p>
</li>
</ol>
<h2 id="using-logging-options">Using Logging Options</h2>
<ol>
<li><p>We saw previously how to read the entire log of a container&#39;s PID 1; we can also use a couple of flags to control what logs are displayed. <code>--tail n</code> limits the display to the last n lines; try it with the container that should be running from the last step:</p>
<pre><code class="lang-bash">$ docker container logs --tail 5 &lt;container ID&gt;
</code></pre>
</li>
<li><p>We can also follow the logs as they are generated with <code>-f</code>:</p>
<pre><code class="lang-bash">$ docker container logs -f &lt;container ID&gt;
</code></pre>
<p>(<code>CTRL+C</code> to break out of following mode).</p>
</li>
<li><p>Finally, try combining the tail and follow flags to begin following the logs from a point further back in history.</p>
</li>
</ol>
<h2 id="conclusion">Conclusion</h2>
<p>In this scenario, we saw how to run processes in the background, attach to them, and inspect their logs. We also saw an explicit example of how killing PID 1 in a container kills the container itself.</p>

        </div>        
    </div>
    <div class="row">
        <ul class="mt-article-pagination" style="display:block;">
        </ul>
    </div>
</div>
    <div class="footer"></div>
</body>