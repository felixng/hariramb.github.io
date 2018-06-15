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
            <h1 id="load-balancing-the-routing-mesh">Load Balancing &amp; the Routing Mesh</h1>
<p>In this exercise, you will observe the behavior of the built in load balancing abilities of the Ingress network.</p>
<h2 id="deploy-a-service">Deploy a service</h2>
<ol>
<li><p>Start by deploying a simple service which spawns containers that echo back their hostname when <code>curl</code>&#39;ed:</p>
<pre><code class="lang-bash">$ docker service create --name who-am-I --publish 8000:8000 --replicas 3 training/whoami:latest
</code></pre>
</li>
</ol>
<h2 id="observe-load-balancing-and-scale">Observe load-balancing and Scale</h2>
<ol>
<li><p>Run <code>curl -4 localhost:8000</code> and observe the output. You should see something similar to the following:</p>
<pre><code class="lang-bash">$ curl -4 localhost:8000
I&#39;m a7e5a21e6e26
</code></pre>
<p>Take note of the response. In this example, our value is <code>a7e5a21e6e26</code>. The <code>whoami</code> containers uniquely identify themselves by returning their respective hostname. So each one of our <code>whoami</code> instances should have a different value.</p>
</li>
<li><p>Run <code>curl -4 localhost:8000</code> again. What can you observe? Notice how the value changes each time. This shows us that the routing mesh has sent our 2nd request over to a different container, since the value was different.</p>
</li>
<li><p>Repeat the command two more times. What can you observe? You should see one new value and then on the 4th request it should revert back to the value of the first container. In this example that value is <code>a7e5a21e6e26</code>.</p>
</li>
<li><p>Scale the number of Tasks for our <code>who-am-I</code> service to 6:</p>
<pre><code class="lang-bash">$ docker service update who-am-I --replicas=6
$ docker service ps who-am-I
</code></pre>
</li>
<li><p>Now run <code>curl -4 localhost:8000</code> multiple times again. Use a script like this:</p>
<pre><code class="lang-bash">$ for n in {1..10}; do curl localhost:8000 -4; done

I&#39;m 263fc24d0789
I&#39;m 57ca6c0c0eb1
I&#39;m c2ee8032c828
I&#39;m c20c1412f4ff
I&#39;m e6a88a30481a
I&#39;m 86e262733b1e
I&#39;m 263fc24d0789
I&#39;m 57ca6c0c0eb1
I&#39;m c2ee8032c828
I&#39;m c20c1412f4ff
</code></pre>
<p>You should be able to observe some new values. Note how the values repeat after the 6th curl command.</p>
</li>
</ol>
<h2 id="the-routing-mesh">The Routing Mesh</h2>
<ol>
<li><p>Run an nginx service and expose the service port 80 on port 8080:</p>
<pre><code class="lang-bash">$ docker service create --name nginx --publish 8080:80 nginx
</code></pre>
</li>
<li><p>Check which node your nginx service task is scheduled on:</p>
<pre><code class="lang-bash">$ docker service ps nginx
</code></pre>
</li>
<li><p>Open a web browser and hit the IP address of that node at port 8080. You should see the NGINX welcome page. Try the same thing with the IP address of any other node in your cluster (using port 8080). You should still be able to see the NGINX welcome page due to the routing mesh.</p>
</li>
</ol>
<h2 id="cleanup">Cleanup</h2>
<ol>
<li><p>Remove all existing services, in preparation for future exercises:</p>
<pre><code class="lang-bash">$ docker service rm $(docker service ls -q)
</code></pre>
</li>
</ol>
<h2 id="conclusion">Conclusion</h2>
<p>In these examples, you saw that requests to an exposed service will be automatically load balanced across all tasks providing that service. Furthermore, exposed services are reachable on all nodes in the swarm - whether they are running a container for that service or not.</p>

        </div>        
    </div>
    <div class="row">
        <ul class="mt-article-pagination" style="display:block;">
        </ul>
    </div>
</div>
    <div class="footer"></div>
</body>