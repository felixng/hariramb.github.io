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
            <h1 id="creating-images-with-dockerfiles-2-2-">Creating Images with Dockerfiles (2/2)</h1>
<h2 id="setting-default-commands">Setting Default Commands</h2>
<ol>
<li><p>Add the following line to your Dockerfile from the last problem, at the bottom:</p>
<pre><code class="lang-bash">...
CMD [&quot;ping&quot;, &quot;127.0.0.1&quot;, &quot;-c&quot;, &quot;5&quot;]
</code></pre>
<p>This sets <code>ping</code> as the default command to run in a container created from this image, and also sets some parameters for that command.</p>
</li>
<li><p>Rebuild your image:</p>
<pre><code class="lang-bash">$ docker image build -t myimage:1.0 .
</code></pre>
</li>
<li><p>Run a container from your new image with no command provided:</p>
<pre><code class="lang-bash">$ docker container run myimage:1.0
</code></pre>
</li>
<li><p>You should see the command provided by the <code>CMD</code> parameter in the Dockerfile running. Try explicitly providing a command when running a container:</p>
<pre><code class="lang-bash">$ docker container run myimage:1.0 echo &quot;hello world&quot;
</code></pre>
<p>Providing a command in <code>docker container run</code> overrides the command defined by <code>CMD</code>.</p>
</li>
<li><p>Replace the <code>CMD</code> instruction in your Dockerfile with an <code>ENTRYPOINT</code>:</p>
<pre><code class="lang-bash">...
ENTRYPOINT [&quot;ping&quot;]
</code></pre>
</li>
<li><p>Build the image and use it to run a container with no process arguments:</p>
<pre><code class="lang-bash">$ docker image build -t myimage:1.0 .
$ docker container run myimage:1.0
</code></pre>
<p>What went wrong?</p>
</li>
<li><p>Try running with an argument after the image name:</p>
<pre><code class="lang-bash">$ docker container run myimage:1.0 127.0.0.1
</code></pre>
<p>Tokens provided after an image name are sent as arguments to the command specified by <code>ENTRYPOINT</code>.</p>
</li>
</ol>
<h2 id="combining-default-commands-and-options">Combining Default Commands and Options</h2>
<ol>
<li><p>Open your Dockerfile and modify the <code>ENTRYPOINT</code> instruction to include 2 arguments for the ping command:</p>
<pre><code class="lang-bash">...
ENTRYPOINT [&quot;ping&quot;, &quot;-c&quot;, &quot;3&quot;]
</code></pre>
</li>
<li><p>If <code>CMD</code> and <code>ENTRYPOINT</code> are both specified in a Dockerfile, tokens listed in <code>CMD</code> are used as default parameters for the <code>ENTRYPOINT</code> command. Add a <code>CMD</code> with a default IP to ping:</p>
<pre><code class="lang-bash">...
CMD [&quot;127.0.0.1&quot;]
</code></pre>
</li>
<li><p>Build the image and run a container with a public IP as an argument to <code>docker container run</code>:</p>
<pre><code class="lang-bash">$ docker container run myimage:1.0 &lt;some public IP&gt;
</code></pre>
</li>
<li><p>Run another container without any arguments after the image name. Explain the difference in behavior between these two last containers.</p>
</li>
</ol>
<h2 id="conclusion">Conclusion</h2>
<p>In this exercise, we encountered the Dockerfile commands <code>CMD</code> and <code>ENTRYPOINT</code>. These are useful for defining the default process to run as PID 1 inside the container right in the Dockerfile, making our containers more like executables and adding clarity to exactly what process was meant to run in a given image&#39;s containers.</p>

        </div>        
    </div>
    <div class="row">
        <ul class="mt-article-pagination" style="display:block;">
        </ul>
    </div>
</div>
    <div class="footer"></div>
</body>