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
            <h1 id="starting-stopping-inspecting-and-deleting-containers">Starting, Stopping, Inspecting and Deleting Containers</h1>
<h2 id="starting-and-restarting-containers">Starting and Restarting Containers</h2>
<ol>
<li><p>Start by running a container in the background, and check that it&#39;s really running:</p>
<pre><code class="lang-bash">$ docker container run -d centos:7 ping 8.8.8.8
$ docker container ls
</code></pre>
</li>
<li><p>Stop the container using <code>docker container stop</code>, and check that the container is indeed stopped:</p>
<pre><code class="lang-bash">$ docker container stop &lt;container ID&gt;
$ docker container ls -a
</code></pre>
</li>
<li><p>Start the container again with <code>docker container start</code>, and attach to it at the same time:</p>
<pre><code class="lang-bash">$ docker container start -a &lt;container ID&gt;
</code></pre>
</li>
<li><p>Detach and stop the container with <code>CTRL+C</code>, then restart the container without attaching and follow the logs starting from 10 lines previous.</p>
</li>
<li><p>Finally, stop the container with <code>docker container kill</code>:</p>
<pre><code class="lang-bash">$ docker container kill &lt;container ID&gt;
</code></pre>
</li>
</ol>
<p>Both <code>stop</code> and <code>kill</code> send a SIGKILL to PID 1 in the container; the difference is that <code>stop</code> first sends a SIGTERM, then waits for a grace period (default 10 seconds) before sending the SIGKILL, while <code>kill</code> fires the SIGKILL immediately.</p>
<h2 id="inspecting-a-container">Inspecting a Container</h2>
<ol>
<li><p>Start your ping container server again, then inspect the container details using <code>docker container inspect</code>:</p>
<pre><code class="lang-bash">$ docker container start &lt;container ID&gt;
$ docker container inspect &lt;container ID&gt;
</code></pre>
</li>
<li><p>Find the container&#39;s IP and long ID in the JSON output of <code>inspect</code>. If you know the key name of the property you&#39;re looking for, try piping to grep:</p>
<pre><code class="lang-bash">$ docker container inspect &lt;container ID&gt; | grep IPAddress
</code></pre>
<p>The output should look similar to this:</p>
<pre><code class="lang-bash">&quot;SecondaryIPAddresses&quot;: null,
&quot;IPAddress&quot;: &quot;&lt;Your IP Address&gt;&quot;
</code></pre>
</li>
<li><p>Now try grepping for <code>Cmd</code>, the PID 1 command being run by this container. <code>grep</code>&#39;s simple text search doesn&#39;t always return helpful results:</p>
<pre><code class="lang-bash">$ docker container inspect &lt;container ID&gt; | grep Cmd
&quot;Cmd&quot;: [
</code></pre>
</li>
<li><p>Another way to filter this JSON is with the <code>--format</code> flag. Syntax follows Go&#39;s text/template package: <a href="http://golang.org/pkg/text/template/">http://golang.org/pkg/text/template/</a>. For example, to find the <code>Cmd</code> value we tried to grep for above, instead try:</p>
<pre><code class="lang-bash">$ docker container inspect --format=&#39;{{.Config.Cmd}}&#39; &lt;container ID&gt;
</code></pre>
</li>
<li><p>Keys nested in the JSON returned by <code>docker container inspect</code> can be chained together in this fashion. Try modifying this example to return the IP address you grepped for previously.</p>
</li>
<li><p>Finally, we can extract all the key/value pairs for a given object using the <code>json</code> function:</p>
<pre><code class="lang-bash">$ docker container inspect --format=&#39;{{json .Config}}&#39; &lt;container ID&gt; | jq
</code></pre>
</li>
</ol>
<h2 id="deleting-containers">Deleting Containers</h2>
<ol>
<li><p>Start three containers in background mode, then stop the first one.</p>
</li>
<li><p>List only exited containers using the <code>--filter</code> flag we learned earlier, and the option <code>status=exited</code>.</p>
</li>
<li><p>Delete the container you stopped above with <code>docker container rm</code>, and do the same listing operation as above to confirm that it has been removed:</p>
<pre><code class="lang-bash">$ docker container rm &lt;container ID&gt;
$ docker container ls ...
</code></pre>
</li>
<li><p>Now do the same to one of the containers that&#39;s still running; notice <code>docker container rm</code> won&#39;t delete a container that&#39;s still running, unless we pass it the force flag <code>-f</code>. Delete the second container you started above:</p>
<pre><code class="lang-bash">$ docker container rm -f &lt;container ID&gt;
</code></pre>
</li>
<li><p>Try using the <code>docker container ls</code> flags we learned previously to remove the last container that was run, or all stopped containers. Recall that you can pass the output of one shell command <code>cmd-A</code> into a variable of another command <code>cmd-B</code> with syntax like <code>cmd-B $(cmd-A)</code>.</p>
</li>
</ol>
<h2 id="conclusion">Conclusion</h2>
<p>In this scenario, you learned how to use <code>docker container start</code>, <code>stop</code>, <code>rm</code> and <code>kill</code> to start, stop and delete containers. You also saw the <code>docker container inspect</code> command, which returns metadata about a given container.</p>

        </div>        
    </div>
    <div class="row">
        <ul class="mt-article-pagination" style="display:block;">
        </ul>
    </div>
</div>
    <div class="footer"></div>
</body>