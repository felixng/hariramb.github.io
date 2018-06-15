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
            <h1 id="creating-images-with-dockerfiles-1-2-">Creating Images with Dockerfiles (1/2)</h1>
<h2 id="writing-and-building-a-dockerfile">Writing and Building a Dockerfile</h2>
<ol>
<li><p>Create a folder called <code>myimage</code>, and a text file called <code>Dockerfile</code> within that folder. In the <code>Dockerfile</code>, include the following instructions:</p>
<pre><code class="lang-bash">FROM centos:7

RUN yum update -y
RUN yum install -y wget
</code></pre>
</li>
<li><p>Build your image with the <code>build</code> command:</p>
<pre><code class="lang-bash">$ docker image build -t myimage .
</code></pre>
</li>
<li><p>Verify that your new image exists with <code>docker image ls</code>, then use it to run a container and <code>wget</code> something from within that container.</p>
</li>
<li><p>It&#39;s also possible to pipe a Dockerfile in from STDIN; try rebuilding your image with the following:</p>
<pre><code class="lang-bash">$ cat Dockerfile | docker image build -t myimage -f - .
</code></pre>
<p>(This is useful when reading a Dockerfile from a remote location with <code>curl</code>, for example).</p>
</li>
</ol>
<h2 id="using-the-build-cache">Using the Build Cache</h2>
<p>In the previous step, the second time you built your image should have completed immediately, with each step save the first reporting <code>using cache</code>. Cached build steps will be used until a change in the Dockerfile is found by the builder.</p>
<ol>
<li><p>Open your Dockerfile and add another <code>RUN</code> step at the end to install <code>vim</code>.</p>
</li>
<li><p>Build the image again as above; which steps is the cache used for?</p>
</li>
<li><p>Build the image again; which steps use the cache this time?</p>
</li>
<li><p>Swap the order of the two <code>RUN</code> commands for installing <code>wget</code> and <code>vim</code> in the Dockerfile, and build one last time. Which steps are cached this time?</p>
</li>
</ol>
<h2 id="using-the-history-command">Using the <code>history</code> Command</h2>
<ol>
<li><p>The <code>docker image history</code> command allows us to inspect the build cache history of an image. Try it with your new image:</p>
<pre><code class="lang-bash">$ docker image history &lt;image ID&gt;
</code></pre>
<p>Note the image id of the layer built for the <code>yum update</code> command.</p>
</li>
<li><p>Replace the two <code>RUN</code> commands that installed <code>wget</code> and <code>vim</code> with a single command:</p>
<pre><code class="lang-bash">...
RUN yum install -y wget vim
</code></pre>
</li>
<li><p>Build the image again, and run <code>docker image history</code> on this new image. How has the history changed?</p>
</li>
</ol>
<h2 id="conclusion">Conclusion</h2>
<p>In this exercise, we&#39;ve seen how to write a basic Dockerfile using <code>FROM</code> and <code>RUN</code> commands, some basics of how image caching works, and seen the <code>docker image history</code> command. Using the build cache effectively is crucial for images that involve lengthy compile or download steps; in general, moving commands that change frequently as late as possible in the Dockerfile will minimize build times. We&#39;ll see some more specific advice on this later in this lesson.</p>

        </div>        
    </div>
    <div class="row">
        <ul class="mt-article-pagination" style="display:block;">
        </ul>
    </div>
</div>
    <div class="footer"></div>
</body>