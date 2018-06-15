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
            <h1 id="interactive-containers">Interactive Containers</h1>
<h2 id="writing-to-containers">Writing to Containers</h2>
<ol>
<li><p>Create a container using the <code>centos:7</code> image, and connect to its bash shell in interactive mode using the <code>-i</code> flag (also the <code>-t</code> flag, to request a TTY connection):</p>
<pre><code class="lang-bash">$ docker container run -it centos:7 bash
</code></pre>
</li>
<li><p>Explore your container&#39;s filesystem with <code>ls</code>, and then create a new file:</p>
<pre><code class="lang-bash">$ ls -l
$ echo &#39;Hello there...&#39; &gt; test.txt
$ ls -l
</code></pre>
</li>
<li><p>Exit the connection to the container:</p>
<pre><code class="lang-bash">$ exit
</code></pre>
</li>
<li><p>Run the same command as above to start a container in the same way:</p>
<pre><code class="lang-bash">$ docker container run -it centos:7 bash
</code></pre>
</li>
<li><p>Try finding your <code>test.txt</code> file inside this new container; it is nowhere to be found. Exit this container for now in the same way you did above.</p>
</li>
</ol>
<h2 id="reconnecting-to-containers">Reconnecting to Containers</h2>
<ol>
<li><p>We&#39;d like to recover the information written to our container in the first example, but starting a new container didn&#39;t get us there; instead, we need to restart our original container, and reconnect to it. List all your stopped containers:</p>
<pre><code class="lang-bash">$ docker container ls -a
</code></pre>
</li>
<li><p>We can restart a container via the container ID listed in the first column. Use the container ID for the first <code>centos:7</code> container you created with <code>bash</code> as its command:</p>
<pre><code class="lang-bash">$ docker container start &lt;container ID&gt;
</code></pre>
</li>
<li><p>Run <code>ps -ef</code> inside the container you just restarted using Docker&#39;s <code>exec</code> command (<code>exec</code> runs the specified process as a child of the PID 1 process inside the container):</p>
<pre><code class="lang-bash">$ docker container exec &lt;container ID&gt; ps -ef
</code></pre>
<p>What process is PID 1 inside the container? Find the PID of that process on the host machine by using:</p>
<pre><code class="lang-bash">$ docker container top &lt;container ID&gt;
</code></pre>
</li>
<li><p>Launch a bash shell in your running container with <code>docker container exec</code>:</p>
<pre><code class="lang-bash">$ docker container exec -it &lt;container ID&gt; bash
</code></pre>
</li>
<li><p>List the contents of the container&#39;s filesystem again with <code>ls -l</code>; your <code>test.txt</code> should be where you left it. Exit the container again by typing <code>exit</code>.</p>
</li>
</ol>
<h2 id="using-container-listing-options">Using Container Listing Options</h2>
<ol>
<li><p>In the last step, we saw how to get the short container ID of all our containers using <code>docker container ls -a</code>. Try adding the <code>--no-trunc</code> flag to see the entire container ID:</p>
<pre><code class="lang-bash">$ docker container ls -a --no-trunc
</code></pre>
<p>This long ID is the same as the string that is returned after starting a container with <code>docker container run</code>.</p>
</li>
<li><p>List only the container ID using the <code>-q</code> flag:</p>
<pre><code class="lang-bash">$ docker container ls -a -q
</code></pre>
</li>
<li><p>List the last container to have been created using the <code>-l</code> flag:</p>
<pre><code class="lang-bash">$ docker container ls -l
</code></pre>
</li>
<li><p>Finally, you can also filter results with the <code>--filter</code> flag; for example, try filtering by exit code:</p>
<pre><code class="lang-bash">$ docker container ls -a --filter &quot;exited=0&quot;
</code></pre>
<p>The output of this command will list the containers that have exited successfully.</p>
</li>
</ol>
<h2 id="conclusion">Conclusion</h2>
<p>In this demo, you saw that files added to a container&#39;s filesystem do not get added to all containers created from the same image; changes to a container&#39;s filesystem are local to itself, and exist only in that particular container. You also learned how to restart a stopped Docker container using <code>docker container start</code>, how to run a command in a running container using <code>docker container exec</code>, and also saw some more options for listing containers via <code>docker container ls</code>.</p>

        </div>        
    </div>
    <div class="row">
        <ul class="mt-article-pagination" style="display:block;">
        </ul>
    </div>
</div>
    <div class="footer"></div>
</body>