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
            <h1 id="scaling-a-compose-app">Scaling a Compose App</h1>
<h2 id="scaling-a-service">Scaling a Service</h2>
<p>Any service defined in our <code>docker-compose.yml</code> can be scaled up from the Compose API; in this context, &#39;scaling&#39; means launching multiple containers for the same service, which Docker Compose can route requests to and from.</p>
<ol>
<li><p>Scale up the <code>worker</code> service in our Dockercoins app to have two workers generating coin candidates, while checking the list of running containers before and after:</p>
<pre><code class="lang-bash">$ docker-compose ps
$ docker-compose scale worker=2
$ docker-compose ps
</code></pre>
</li>
<li><p>Look at the performance graph provided by the web frontend; the coin mining rate should have doubled. Also check the logs using the logging API we learned in the last exercise; you should see a second <code>worker</code> instance reporting.</p>
</li>
</ol>
<h2 id="investigating-bottlenecks">Investigating Bottlenecks</h2>
<ol>
<li><p>Try running <code>top</code> to inspect the system resource usage; it should still be fairly negligible. So, keep scaling up your workers:</p>
<pre><code class="lang-bash">$ docker-compose scale worker=10
$ docker-compose ps
</code></pre>
</li>
<li><p>Check your web frontend again; has going from 2 to 10 workers provided a 5x performance increase? It seems that something else is bottlenecking our application; any distributed application such as Dockercoins needs tooling to understand where the bottlenecks are, so that the application can be scaled intelligently.</p>
</li>
<li><p>Look in <code>docker-compose.yml</code> at the <code>rng</code> and <code>hasher</code> services; they&#39;re exposed on host ports 8001 and 8002, so we can use <code>httping</code> to probe their latency. First we need to install <code>httping</code>:</p>
<pre><code class="lang-bash">$ sudo yum install -y httping
</code></pre>
</li>
<li><p>Now we can use this tool to probe the latency:</p>
<pre><code class="lang-bash">$ httping -c 10 localhost:8001
$ httping -c 10 localhost:8002
</code></pre>
<p><code>rng</code> on port 8001 has the much higher latency, suggesting that it might be our bottleneck. A random number generator based on entropy won&#39;t get any better by starting more instances on the same machine; we&#39;ll need a way to bring more nodes into our application to scale past this, which we&#39;ll explore in the next unit on Docker Swarm.</p>
</li>
<li><p>For now, shut your app down:</p>
<pre><code class="lang-bash">$ docker-compose down
</code></pre>
</li>
</ol>
<h2 id="conclusion">Conclusion</h2>
<p>In this exercise, we saw how to scale up a service defined in our Compose app using the <code>scale</code> API object. Also, we saw how crucial it is to have detailed monitoring and tooling in a microservices-oriented application, in order to correctly identify bottlenecks and take advantage of the simplicity of scaling with Docker.</p>

        </div>        
    </div>
    <div class="row">
        <ul class="mt-article-pagination" style="display:block;">
        </ul>
    </div>
</div>
    <div class="footer"></div>
</body>