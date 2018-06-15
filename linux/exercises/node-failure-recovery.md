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
            <h1 id="node-failure-recovery">Node Failure Recovery</h1>
<p>In Swarm Mode, services created with <code>docker service create</code> are primary; if something goes wrong with the cluster, the manager leader does everything possible to restore the state of all services.</p>
<h2 id="set-up-a-service">Set up a Service</h2>
<ol>
<li><p>Set up a <code>myProxy</code> service with four replicas on one of your manager nodes:</p>
<pre><code class="lang-bash">manager$ docker service create --replicas 4 --name myProxy nginx
</code></pre>
</li>
<li><p>Now watch the output of <code>docker service ps</code> on the same node:</p>
<pre><code class="lang-bash">manager$ watch docker service ps myProxy
</code></pre>
</li>
</ol>
<h2 id="simulate-node-failure">Simulate Node Failure</h2>
<ol>
<li><p>SSH into the one non-manager node in your swarm, and simulate a node failure by rebooting it:</p>
<pre><code class="lang-bash">worker$ sudo reboot now
</code></pre>
</li>
<li><p>Back on your manager node, watch the updates to <code>docker service ps</code>; what happens to the task running on the rebooted node?</p>
</li>
</ol>
<h2 id="cleanup">Cleanup</h2>
<ol>
<li><p>On your manager node, remove all existing services, in preparation for future exercises:</p>
<pre><code class="lang-bash">manager$ docker service rm $(docker service ls -q)
</code></pre>
</li>
</ol>
<h2 id="conclusion">Conclusion</h2>
<p>In this exercise, you saw Swarm Mode&#39;s scheduler in action - when a node is lost from the swarm, tasks are automatically rescheduled to restore the state of our services.</p>

        </div>        
    </div>
    <div class="row">
        <ul class="mt-article-pagination" style="display:block;">
        </ul>
    </div>
</div>
    <div class="footer"></div>
</body>