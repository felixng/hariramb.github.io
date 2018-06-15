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
            <h1 id="container-port-mapping">Container Port Mapping</h1>
<h2 id="port-mapping-at-runtime">Port Mapping at Runtime</h2>
<ol>
<li><p>Run an nginx container with no special port mappings:</p>
<pre><code class="lang-bash">$ docker container run -d nginx
</code></pre>
<p>nginx stands up a landing page at <code>&lt;ip&gt;:80</code>; try to visit this at your host or container&#39;s IP, and it won&#39;t be visible; no external traffic can make it past the linux bridge&#39;s firewall to the nginx container.</p>
</li>
<li><p>Now run an nginx container and map port 80 on the container to port 5000 on your host using the <code>-p</code> flag:</p>
<pre><code class="lang-bash">$ docker container run -d -p 5000:80 nginx
</code></pre>
<p>Note that the syntax is: <code>-p [host-port]:[container-port]</code>.</p>
</li>
<li><p>Verify the port mappings with the <code>docker container port</code> command</p>
<pre><code class="lang-bash">$ docker container port &lt;container id&gt;
</code></pre>
</li>
<li><p>Visit your nginx landing page at <code>&lt;host ip&gt;:5000</code>, e.g. using <code>curl -4 localhost:5000</code>.</p>
</li>
</ol>
<h2 id="exposing-ports-from-the-dockerfile">Exposing Ports from the Dockerfile</h2>
<ol>
<li><p>In addition to manual port mapping, we can expose some ports in a Dockerfile for automatic port mapping on container startup. In a fresh directory, create a Dockerfile:</p>
<pre><code class="lang-bash">FROM nginx

EXPOSE 80
</code></pre>
</li>
<li><p>Build your image as <code>my_nginx</code>:</p>
<pre><code class="lang-bash">$ docker image build -t my_nginx .
</code></pre>
</li>
<li><p>Use the <code>-P</code> flag when running to map all ports mentioned in the <code>EXPOSE</code> directive:</p>
<pre><code class="lang-bash">$ docker container run -d -P my_nginx
</code></pre>
</li>
<li><p>Use <code>docker container ls</code> or <code>docker container port</code> to find out what host ports were used, and visit your nginx landing page at the appropriate ip/port.</p>
</li>
</ol>
<h2 id="conclusion">Conclusion</h2>
<p>In this exercise, we saw how to explicitly map ports from our container&#39;s network stack onto ports of our host at runtime with the <code>-p</code> option to <code>docker container run</code>, or more flexibly in our Dockerfile with <code>EXPOSE</code>, which will result in the listed ports inside our container being mapped to random available ports on our host.</p>

        </div>        
    </div>
    <div class="row">
        <ul class="mt-article-pagination" style="display:block;">
        </ul>
    </div>
</div>
    <div class="footer"></div>
</body>