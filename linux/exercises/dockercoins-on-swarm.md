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
            <h1 id="dockercoins-on-swarm">Dockercoins On Swarm</h1>
<p>In this example, we&#39;ll go through the preparation and deployment of a sample application, our dockercoins miner, on our swarm. We&#39;ll define our app using a <code>docker-compose.yml</code> file, and deploy is as our first example of a stack.</p>
<h2 id="prepare-service-images">Prepare Service Images</h2>
<ol>
<li>If you haven&#39;t done so already, follow the &#39;Prepare Service Images&#39; step in the &#39;Starting a Compose App&#39; exercise in this book, on your manager node. In this step, you built all the images you need for your app and pushed them to Docker Hub, so they&#39;d be available for every node in your swarm.</li>
</ol>
<h2 id="start-our-services">Start our Services</h2>
<ol>
<li><p>Now that everything is prepped, we can start our stack. On the manager node and from <code>orchestration-workshop/dockercoins</code>:</p>
<pre><code class="lang-bash">$ docker stack deploy -c=docker-compose.yml dc
</code></pre>
</li>
<li><p>Check and see how your services are doing:</p>
<pre><code class="lang-bash">$ docker stack services dc
</code></pre>
<p>Notice the <code>REPLICAS</code> column in the output of above command; this shows how many of your desired replicas are running. At first, a few might show 0/1; before those tasks can start, the worker nodes will need to download the appropriate images from Docker Hub.</p>
</li>
<li><p>Wait a minute or two, and try <code>docker stack services dc</code> again; once all services show 100% of their replicas are up, things are running properly and you can point your browser to port 8000 on one of the swarm nodes (does it matter which one)? You should see a graph of your dockercoin mining speed, around 3 hashes per second.</p>
</li>
<li><p>Finally, check out the details of the tasks running in your stack with <code>stack ps</code>:</p>
<pre><code class="lang-bash">$ docker stack ps dc
</code></pre>
<p>This shows the details of each running container involved in your stack - if all is well, there should be five, one for each service in the stack.</p>
</li>
</ol>

        </div>        
    </div>
    <div class="row">
        <ul class="mt-article-pagination" style="display:block;">
        </ul>
    </div>
</div>
    <div class="footer"></div>
</body>