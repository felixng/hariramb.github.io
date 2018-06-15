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
            <h1 id="starting-a-compose-app">Starting a Compose App</h1>
<p>In a microservice-oriented design pattern, labor is divided among modular, independent services, many of which cooperate to form a full application. Docker images and containerization naturally enable this paradigm by using images to define services, and containers to correspond to instances of those services. In order to be successful, each running container will need to be able to interact; Docker Compose facilitates these interactions on a single host. In this example, we&#39;ll explore a toy example of such an application orchestrated by Docker Compose.</p>
<h2 id="preparing-service-images">Preparing Service Images</h2>
<ol>
<li><p>Download the Dockercoins app from github:</p>
<pre><code class="lang-bash">$ git clone -b ee2.0 https://github.com/docker-training/orchestration-workshop.git
</code></pre>
<p>This app consists of 5 services: a random number generator <code>rng</code>, a <code>hasher</code>, a backend <code>worker</code>, a <code>redis</code> queue, and a <code>web</code> frontend. Each service has a corresponding image, which we will build and push to Docker Store for later use (if you don&#39;t have a Docker Store account, make a free one first at <a href="https://store.docker.com">https://store.docker.com</a>).</p>
</li>
<li><p>Log into your Docker Store account from the command line:</p>
<pre><code class="lang-bash">$ docker login
</code></pre>
</li>
<li><p>Build and push the images corresponding to the <code>rng</code>, <code>hasher</code>, <code>worker</code> and <code>webui</code> services. For <code>hasher</code>, this looks like (from the <code>orchestration-workshop/dockercoins</code> folder you just cloned from GitHub):</p>
<pre><code class="lang-bash">$ docker image build -t &lt;Docker ID&gt;/dockercoins_hasher:1.0 hasher
$ docker image push &lt;Docker ID&gt;/dockercoins_hasher:1.0
</code></pre>
<p>Repeat this three more times, for <code>rng</code>, <code>worker</code>, and <code>webui</code>.</p>
</li>
<li><p>Look in <code>docker-compose.yml</code>, and change all the <code>image</code> values to have your Docker ID instead of <code>user</code>; now you&#39;ll be able to use this Compose file to set up your app on any machine that can reach Docker Store.</p>
</li>
</ol>
<h2 id="starting-the-app">Starting the App</h2>
<ol>
<li><p>Stand up the app (you may need to install Docker Compose first, if this didn&#39;t come pre-installed on your machine; see the instructions at <a href="https://docs.docker.com/compose/install/">https://docs.docker.com/compose/install/</a>):</p>
<pre><code class="lang-bash">$ docker-compose up
</code></pre>
</li>
<li><p>Logs from all the running services are sent to STDOUT. Let&#39;s send this to the background instead; kill the app with <code>CTRL+C</code>, sending a <code>SIGTERM</code> to all running processes; some exit immediately, while others wait for a 10s timeout before being killed by a subsequent <code>SIGKILL</code>. Start the app again in the background:</p>
<pre><code class="lang-bash">$ docker-compose up -d
</code></pre>
</li>
<li><p>Check out which containers are running thanks to Compose:</p>
<pre><code class="lang-bash">$ docker-compose ps
</code></pre>
</li>
<li><p>Compare this to the usual <code>docker container ls</code>; at this point, it should look about the same if you started from a fresh node. Start any other container with <code>docker container run</code>, and try both <code>ls</code> commands again. Do you notice any difference?</p>
</li>
<li><p>With all five containers running, visit Dockercoins&#39; web UI at <code>&lt;IP&gt;:8000</code>. You should see a chart of mining speed, around 4 hashes per second.</p>
</li>
</ol>
<h2 id="viewing-logs">Viewing Logs</h2>
<ol>
<li><p>See logs from a Compose-managed app via:</p>
<pre><code class="lang-bash">$ docker-compose logs
</code></pre>
</li>
<li><p>The logging API in Compose follows the main Docker logging API closely. For example, try following the tail of the logs just like you would for regular container logs:</p>
<pre><code class="lang-bash">$ docker-compose logs --tail 10 --follow
</code></pre>
<p>Note that when following a log, <code>CTRL+S</code> and <code>CTRL+Q</code> pauses and resumes live following.</p>
</li>
</ol>
<h2 id="conclusion">Conclusion</h2>
<p>In this exercise, you saw how to start a pre-defined Compose app, and how to inspect its logs. Application logic was defined in each of the five images we used to create containers for the app, but the manner in which those containers were created was defined in the <code>docker-compose.yml</code> file; every aspect of how many containers we want for each service, what networks to attach those containers to and what other parameters are desired, is captured in this manifest. Finally, the different elements of Dockercoins communicated with each other via service name; the Docker daemon&#39;s internal DNS was able to resolve traffic destined for a service, into the IP or MAC address of the corresponding container.</p>

        </div>        
    </div>
    <div class="row">
        <ul class="mt-article-pagination" style="display:block;">
        </ul>
    </div>
</div>
    <div class="footer"></div>
</body>