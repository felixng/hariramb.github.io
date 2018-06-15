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
            <h1 id="running-inspecting-containers">Running &amp; Inspecting Containers</h1>
<h2 id="running-containers">Running Containers</h2>
<ol>
<li><p>First, let&#39;s start a container, and observe the output:</p>
<pre><code class="lang-bash">$ docker container run centos:7 echo &quot;hello world&quot;
</code></pre>
<p>The <code>centos:7</code> part indicates the <em>image</em> we want to use to define this container; it defines a private filesystem for the container. <code>echo &quot;hello world&quot;</code> is the process we want to execute inside the kernel namespaces created when we use <code>docker container run</code>.</p>
</li>
<li><p>Now create another container from the same image, and run a different process inside of it:</p>
<pre><code class="lang-bash">$ docker container run centos:7 ps -ef
</code></pre>
</li>
<li><p><code>ps -ef</code> was PID 1 inside the container in the last step; try doing <code>ps -ef</code> at the host prompt and see what process is PID 1 here.</p>
</li>
</ol>
<h2 id="listing-containers">Listing Containers</h2>
<ol>
<li><p>Try listing all your currently running containers:</p>
<pre><code class="lang-bash">$ docker container ls
</code></pre>
<p>There&#39;s nothing listed, since the containers you ran executed a single command, and shut down when finished.</p>
</li>
<li><p>List stopped as well as running containers with the <code>-a</code> flag:</p>
<pre><code class="lang-bash">$ docker container ls -a
</code></pre>
</li>
</ol>
<h2 id="conclusion">Conclusion</h2>
<p>In this exercise you ran your first container using <code>docker container run</code>, and explored the importance of the PID 1 process in a container; this process is a member of the host&#39;s PID tree like any other, but is &#39;containerized&#39; via tools like kernel namespaces, making this process and its children behave as if it was the root of a PID tree, with its own filesystem, mountpoints, and network stack. The PID 1 process in a container defines the lifecycle of the container itself; when one exits, so does the other.</p>

        </div>        
    </div>
    <div class="row">
        <ul class="mt-article-pagination" style="display:block;">
        </ul>
    </div>
</div>
    <div class="footer"></div>
</body>