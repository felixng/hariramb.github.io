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
            <h1 id="cleaning-up-docker-resources">Cleaning up Docker Resources</h1>
<p>Once we start to use Docker heavily, we want to understand what resouces the Docker engine is using. We also want tools to free up resources. For all this we can use the <code>docker system</code> commands.</p>
<ol>
<li><p>Find out how much memory Docker is using by executing:</p>
<pre><code class="lang-bash">$ docker system df
</code></pre>
<p>The output will show us how much space images, containers and (local) volumes are occupying and how much of this space can be reclaimed.</p>
</li>
<li><p>Reclaim all reclaimable space by using the following command:</p>
<pre><code class="lang-bash">$ docker system prune
</code></pre>
<p>Answer with <code>y</code> when asked if we really want to remove all unused networks, containers, images and volumes.</p>
</li>
<li><p>Create a couple of containers with labels (these will exit immediately; why?):</p>
<pre><code class="lang-bash">$ docker container run --label apple --name fuji -d alpine
$ docker container run --label orange --name clementine -d alpine
</code></pre>
</li>
<li><p>Delete only those stopped containers bearing the <code>apple</code> label:</p>
<pre><code class="lang-bash">$ docker container ls -a
$ docker container prune --filter &#39;label=apple&#39;
$ docker container ls -a
</code></pre>
<p>Only the container named <code>clementine</code> should remain after the targeted prune.</p>
</li>
<li><p>Finally, prune containers launched before a given timestamp using the <code>until</code> filter; start by getting the current RFC 3339 time (<a href="https://tools.ietf.org/html/rfc3339">https://tools.ietf.org/html/rfc3339</a> - note Docker <em>requires</em> the otherwise optional <code>T</code> separating date and time), then creating a new container:</p>
<pre><code class="lang-bash">$ TIMESTAMP=$(date --rfc-3339=seconds | sed &#39;s/ /T/&#39;)
$ docker container run --label tomato --name beefsteak -d alpine
</code></pre>
<p>And use the timestamp returned in a prune:</p>
<pre><code class="lang-bash">$ docker container prune -f --filter &quot;until=$TIMESTAMP&quot;
$ docker container ls -a
</code></pre>
<p>Note the <code>-f</code> flag, to suppress the confirmation step. <code>label</code> and <code>until</code> filters for pruning are also available for networks and images, while data volumes can only be selectively pruned by <code>label</code>; finally, images can also be pruned by the boolean <code>dangling</code> key, indicating if the image is untagged.</p>
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