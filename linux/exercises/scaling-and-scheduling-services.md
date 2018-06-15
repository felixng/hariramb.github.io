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
            <h1 id="scaling-and-scheduling-services">Scaling and Scheduling Services</h1>
<h2 id="scaling-up-a-service">Scaling up a Service</h2>
<p>If we&#39;ve written our services to be stateless, we might hope for linear performance scaling in the number of replicas of that service. For example, our <code>worker</code> service requests a random number from the <code>rng</code> service and hands it off to the <code>hasher</code> service; the faster we make those requests, the higher our throughput of dockercoins should be, as long as there are no other confounding bottlenecks.</p>
<ol>
<li><p>Modify the <code>worker</code> service definition in <code>docker-compose.yml</code> to set the number of replicas to create using the <code>deploy</code> key:</p>
<pre><code class="lang-yaml">worker:
  image: user/dockercoins_worker:1.0
  networks:
  - dockercoins
  deploy:
     replicas: 2
</code></pre>
</li>
<li><p>Update your app by running the same command you used to launch it in the first place:</p>
<pre><code class="lang-bash">$ docker stack deploy -c docker-compose.yml dc
</code></pre>
</li>
<li><p>Once both replicas of the <code>worker</code> service are live, check the web frontend; you should see about double the number of hashes per second, as expected.</p>
</li>
<li><p>Scale up even more by changing the <code>worker</code> replicas to 10. A small improvement should be visible, but certainly not an additional factor of 5. Something else is bottlenecking dockercoins.</p>
</li>
</ol>
<h2 id="scheduling-services">Scheduling Services</h2>
<p>Something other than <code>worker</code> is bottlenecking dockercoins&#39;s performance; the first place to look is in the services that <code>worker</code> directly interacts with.</p>
<ol>
<li><p>The <code>rng</code> and <code>hasher</code> services are exposed on host ports 8001 and 8002, so we can use <code>httping</code> to probe their latency:</p>
<p>If you have not already done so in a previous exercise, make sure you have <code>httping</code> installed:</p>
<pre><code class="lang-bash">$ sudo yum install -y httping
</code></pre>
<p>and then:</p>
<pre><code class="lang-bash">$ httping -c 10 localhost:8001
$ httping -c 10 localhost:8002
</code></pre>
<p><code>rng</code> is much slower to respond, suggesting that it might be the bottleneck. If this random number generator is based on an entropy collector (random voltage microfluctuations in the machine&#39;s power supply, for example), it won&#39;t be able to generate random numbers beyond a physically limited rate; we need more machines collecting more entropy in order to scale this up. This is a case where it makes sense to run exactly one copy of this service per machine, via <code>global</code> scheduling (as opposed to potentially many copies on one machine, or whatever the scheduler decides as in the default <code>replicated</code> scheduling).</p>
</li>
<li><p>Modify the definition of our <code>rng</code> service in <code>docker-compose.yml</code> to be globally scheduled:</p>
<pre><code class="lang-yaml">rng:
  image: user/dockercoins_rng:1.0
  networks:
  - dockercoins
  ports:
  - &quot;8001:80&quot;
  deploy:
    mode: global
</code></pre>
</li>
<li><p>Scheduling can&#39;t be changed on the fly, so we need to stop our app and restart it:</p>
<pre><code class="lang-bash">$ docker stack rm dc
$ docker stack deploy -c=docker-compose.yml dc
</code></pre>
</li>
<li><p>Check the web frontend again; the overall factor of 10 improvement (from ~3 to ~35 hashes per second) should now be visible.</p>
</li>
</ol>
<h2 id="conclusion">Conclusion</h2>
<p>In this exercise, you explored the performance gains a distributed application can enjoy by scaling a key service up to have more replicas, and by correctly scheduling a service that needs to be replicated across physically different nodes.</p>

        </div>        
    </div>
    <div class="row">
        <ul class="mt-article-pagination" style="display:block;">
        </ul>
    </div>
</div>
    <div class="footer"></div>
</body>