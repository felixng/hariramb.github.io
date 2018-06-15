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
            <h1 id="updating-a-service">Updating a Service</h1>
<h2 id="creating-rolling-updates">Creating Rolling Updates</h2>
<ol>
<li><p>First, let&#39;s change one of our services a bit: open <code>orchestration-workshop/dockercoins/worker/worker.py</code> in your favorite text editor, and find the following section:</p>
<pre><code class="lang-python">def work_once():
    log.debug(&quot;Doing one unit of work&quot;)
 time.sleep(0.1)
</code></pre>
<p>Change the <code>0.1</code> to a <code>0.01</code>. Save the file, exit the text editor. </p>
</li>
<li><p>Rebuild the worker image with a tag of <code>&lt;Docker ID&gt;/dockercoins_worker:1.1</code>, and push it to Docker Hub.</p>
</li>
<li><p>Open a new ssh connection to your manager node, and set it to watch the following:</p>
<pre><code class="lang-bash">$ watch -n1 &quot;docker service ps dc_worker | grep -v Shutdown.*Shutdown&quot;
</code></pre>
<p>(this last step isn&#39;t necessary to do an update, but is just for illustrative purposes to help us watch the update in action). </p>
</li>
<li><p>Switch back to your original connection to your manager, and start the update:</p>
<pre><code class="lang-bash">$ docker service update dc_worker --image &lt;Docker ID&gt;/dockercoins_worker:1.1
</code></pre>
</li>
<li><p>Switch back to your new terminal and observe the output. You should notice the tasks images being updated to our new 1.1 image one at a time.</p>
</li>
</ol>
<h2 id="parallelizing-updates">Parallelizing Updates</h2>
<ol>
<li><p>We can also set our updates to run in batches by configuring some options associated with each service. On your first connection to your manager, change the parallelism to 2 and the delay to 5 seconds on the  <code>worker</code> service by editing its definition in the <code>docker-compose.yml</code>:</p>
<pre><code class="lang-yaml">worker:
  image: &lt;Docker ID&gt;/dockercoins_worker:1.0
  networks:
  - dockercoins
  deploy:
    replicas: 10
    update_config:
      parallelism: 2
      delay: 5s
</code></pre>
</li>
<li><p>Roll back the worker service to 1.0:</p>
<pre><code class="lang-bash">$ docker stack deploy -c=docker-compose.yml dc
</code></pre>
</li>
<li><p>On the second connection to manager, the <code>watch</code> should show instances being updated two at a time, with a five second pause between updates.</p>
</li>
</ol>
<h2 id="configuring-rollback-contingencies">Configuring Rollback Contingencies</h2>
<p>In the event of an application or container failure on deployment, we&#39;d like to automatically roll the update back to the previous version.</p>
<ol>
<li><p>Update the <code>worker</code> service with some parameters to define rollback:</p>
<pre><code class="lang-yaml">$ docker service update \
    --update-failure-action=rollback \
    --rollback-parallelism=2 \
    --rollback-monitor=20s \
    --rollback-max-failure-ratio=0.2 \
    dc_worker
</code></pre>
<p>These parameters will trigger a rollback, two containers at a time, if more than 20% of services tasks fail in the first 20 seconds after an update. If any of the pre-rollback containers didn&#39;t fail, an <code>order: start-first</code> key indicates that the rollback containers should start <em>before</em> the remaining containers from the failed update are killed off.</p>
</li>
<li><p>Make a broken version of the <code>worker</code> service to trigger a rollback with; try removing all the <code>import</code> commands at the top of <code>worker.py</code>, for example. Then rebuild the worker image with a new tag, and attempt to update your service:</p>
<pre><code class="lang-bash">$ docker image build -t &lt;Docker ID&gt;/dockercoins_worker:bugged .
$ docker image push &lt;Docker ID&gt;/dockercoins_worker:bugged
$ docker service update dc_worker --image &lt;Docker ID&gt;/dockercoins_worker:bugged
</code></pre>
</li>
<li><p>The connection to your manager running <code>watch</code> should show the <code>:bugged</code> tag getting deployed, failing, and rolling back to <code>:1.0</code> automatically.</p>
</li>
</ol>
<h2 id="shutting-down-a-stack">Shutting Down a Stack</h2>
<ol>
<li><p>To shut down a running stack:</p>
<pre><code class="lang-bash">$ docker stack rm &lt;stack name&gt;
</code></pre>
<p>Where the stack name can be found in the output of <code>docker stack ls</code>.</p>
</li>
</ol>
<h2 id="conclusion">Conclusion</h2>
<p>In this exercise, we explored deploying and redeploying an application as stacks and services. Note that relaunching a running stack updates all the objects it manages in the most non-disruptive way possible; there is usually no need to remove a stack before updating it. In production, rollback contingencies should always be used to cautiously upgrade images, cutting off potential damage before an entire service is taken down.</p>

        </div>        
    </div>
    <div class="row">
        <ul class="mt-article-pagination" style="display:block;">
        </ul>
    </div>
</div>
    <div class="footer"></div>
</body>