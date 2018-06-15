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
            <h1 id="creating-a-swarm">Creating a Swarm</h1>
<p>In this exercise, we&#39;ll see how to set up a swarm using Docker Swarm Mode, including joining workers and promoting workers into the manager consensus.</p>
<h2 id="start-swarm-mode">Start Swarm Mode</h2>
<ol>
<li><p>Enable Swarm Mode on whatever node is to be your first manager node:</p>
<pre><code class="lang-bash">$ docker swarm init
</code></pre>
</li>
<li><p>Confirm that Swarm Mode is active by inspecting the output of:</p>
<pre><code class="lang-bash">$ docker system info
</code></pre>
</li>
<li><p>See all nodes currently in your swarm by doing:</p>
<pre><code class="lang-bash">$ docker node ls
</code></pre>
<p>A single node is reported in the cluster.</p>
</li>
<li><p>Change the certificate rotation period from the default of 90 days to one week, and rotate the certificate now:</p>
<pre><code class="lang-bash">$ docker swarm ca --rotate --cert-expiry 168h
</code></pre>
<p>Note that the <code>docker swarm ca [options]</code> command <em>must</em> receive the <code>--rotate</code> flag, or all other flags will be ignored.</p>
</li>
<li><p>Display UDP and TCP activity on your manager:</p>
<pre><code class="lang-bash">$ sudo netstat -plunt
</code></pre>
<p>You should see (at least) TCP+UDP 7946, UDP 4789, and TCP 2377. What are each of these ports for?</p>
</li>
</ol>
<h2 id="add-workers-to-the-swarm">Add Workers to the Swarm</h2>
<p>A single node swarm is not a particularly interesting swarm; let&#39;s add some workers to really see Swarm Mode in action.</p>
<ol>
<li><p>On your manager node, get the swarm &#39;join token&#39; you&#39;ll use to add worker nodes to your swarm:</p>
<pre><code class="lang-bash">$ docker swarm join-token worker
</code></pre>
</li>
<li><p>SSH into a second node, and paste the result of the last step there. This new node will have joined the swarm as a worker.</p>
</li>
<li><p>Inspect the network on your worker node with <code>sudo netstat -plunt</code> like you did for the manager node. Are the same ports open? Why or why not?</p>
</li>
<li><p>Do <code>docker node ls</code> on the manager again, and you should see both your nodes and their status; note that <code>docker node ls</code> won&#39;t work on a worker node, as the cluster status is maintained only by the manager nodes.</p>
</li>
<li><p>Finally, use the same join token to add two more workers to your swarm. When you&#39;re done, confirm that <code>docker node ls</code> on your one manager node reports 4 nodes in the cluster - one manager, and three workers.</p>
</li>
</ol>
<h2 id="promoting-workers-to-managers">Promoting Workers to Managers</h2>
<p>At this point, our swarm has a single manager. If this node goes down, the whole Swarm is lost. In a real deployment, this is unacceptable; we need some redundancy to our system, and Swarm Mode achieves this by allowing a Raft consensus of multiple managers to preserve swarm state.</p>
<ol>
<li><p>Promote two of your workers to manager status by executing, on the current manager node:</p>
<pre><code class="lang-bash">$ docker node promote node-1 node-2
</code></pre>
<p>where <code>node-1</code> and <code>node-2</code> are the hostnames of the two workers you want to promote to managerial status (look at the output of <code>docker node ls</code> if you&#39;re not sure what your hostnames are).</p>
</li>
<li><p>Finally, do a <code>docker node ls</code> to check and see that you now have three managers. Note that manager nodes also count as worker nodes - tasks can still be scheduled on them as normal.</p>
</li>
</ol>
<h2 id="conclusion">Conclusion</h2>
<p>In this exercise, you saw how to set up a swarm with basic API objects <code>docker swarm init</code> and <code>docker swarm join</code>, as well as how to inspect the state of the swarm with <code>docker node ls</code> and <code>docker system info</code>. Finally, you promoted worker nodes to the manager consensus with <code>docker node promote</code>.</p>

        </div>        
    </div>
    <div class="row">
        <ul class="mt-article-pagination" style="display:block;">
        </ul>
    </div>
</div>
    <div class="footer"></div>
</body>