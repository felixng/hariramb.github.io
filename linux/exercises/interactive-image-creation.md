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
            <h1 id="interactive-image-creation">Interactive Image Creation</h1>
<h2 id="modifying-a-container">Modifying a Container</h2>
<ol>
<li><p>Start a bash terminal in a CentOS container:</p>
<pre><code class="lang-bash">$ docker container run -it centos:7 bash
</code></pre>
</li>
<li><p>Install a couple pieces of software in this container - there&#39;s nothing special about <code>vim</code> and <code>wget</code>, any changes to the filesystem will do. Afterwards, exit the container:</p>
<pre><code class="lang-bash">$ yum update -y
$ yum install -y wget vim
$ exit
</code></pre>
</li>
<li><p>Finally, try <code>docker container diff</code> to see what&#39;s changed about a container relative to its image; you&#39;ll need to get the container ID via <code>docker container ls -a</code> first:</p>
<pre><code class="lang-bash">$ docker container ls -a
$ docker container diff &lt;container ID&gt;
</code></pre>
<p>Make sure the results of the diff make sense to you before moving on.</p>
</li>
</ol>
<h2 id="capturing-container-state-as-an-image">Capturing Container State as an Image</h2>
<ol>
<li><p>Installing wget and vim in the last step wrote information to the container&#39;s read/write layer; now let&#39;s save that read/write layer as a new read-only image layer in order to create a new image that reflects our additions, via the <code>docker container commit</code>:</p>
<pre><code class="lang-bash">$ docker container commit &lt;container ID&gt; myapp:1.0
</code></pre>
</li>
<li><p>Check that you can see your new image by listing all your images:</p>
<pre><code class="lang-bash">$ docker image ls
</code></pre>
</li>
<li><p>Create a container running bash using your new image, and check that vim and wget are installed:</p>
<pre><code class="lang-bash">$ docker container run -it myapp:1.0 bash
$ which vim
$ which wget
</code></pre>
</li>
<li><p>Create a file in your container and commit that as a new image. Use the same image name but tag it as 1.1.</p>
</li>
<li><p>Finally, run <code>docker container diff</code> on your most recent container; does the output make sense? What do you guess the prefixes A, C and D at the start of each line mean?</p>
</li>
</ol>
<h2 id="conclusion">Conclusion</h2>
<p>In this exercise, you saw how to inspect the contents of a container&#39;s read / write layer with <code>docker container diff</code>, and commit those changes to a new image layer with <code>docker container commit</code>.</p>

        </div>        
    </div>
    <div class="row">
        <ul class="mt-article-pagination" style="display:block;">
        </ul>
    </div>
</div>
    <div class="footer"></div>
</body>