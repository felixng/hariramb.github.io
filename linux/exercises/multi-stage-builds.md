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
            <h1 id="multi-stage-builds">Multi-Stage Builds</h1>
<p>In this exercise, you&#39;ll work with a multi-stage Dockerfile to build two versions of your image: a development version with lots of tooling in place, and a production-ready version that&#39;s as lightweight as possible.</p>
<h2 id="defining-a-multi-stage-build">Defining a multi-stage build</h2>
<ol>
<li><p>Make a fresh folder <code>multi-stage</code> to do this exercise in, and <code>cd</code> into it.</p>
</li>
<li><p>Add a file <code>hello.c</code> to the <code>multi-stage</code> folder containing <strong>Hello World</strong> in C:</p>
<pre><code class="lang-c">#include &lt;stdio.h&gt;

int main (void)
{
    printf (&quot;Hello, world!\n&quot;);
    return 0;
}
</code></pre>
</li>
<li><p>Try compiling and running this right on the host OS:</p>
<pre><code class="lang-bash">$ sudo yum install -y gcc
$ gcc -Wall hello.c -o hello
$ ./hello
</code></pre>
</li>
<li><p>Now let&#39;s Dockerize our hello world application. Add a <code>Dockerfile</code> to the <code>multi-stage</code> folder with this content:</p>
<pre><code class="lang-bash">FROM alpine:3.5
RUN apk update &amp;&amp; \
    apk add --update alpine-sdk
RUN mkdir /app
WORKDIR /app
COPY hello.c /app
RUN mkdir bin
RUN gcc -Wall hello.c -o bin/hello
CMD /app/bin/hello
</code></pre>
</li>
<li><p>Build the image and observe its (massive) size:</p>
<pre><code class="lang-bash">$ docker image build -t my-app-large .
$ docker image ls | grep my-app-large
</code></pre>
</li>
<li><p>Update your Dockerfile to use an <code>AS</code> clause on the first line, and add a second stanza describing a second build stage:</p>
<pre><code class="lang-bash">FROM alpine:3.5 AS build
RUN apk update &amp;&amp; \
    apk add --update alpine-sdk
RUN mkdir /app
WORKDIR /app
COPY hello.c /app
RUN mkdir bin
RUN gcc -Wall hello.c -o bin/hello

FROM alpine:3.5
COPY --from=build /app/bin/hello /app/hello
CMD /app/hello
</code></pre>
</li>
<li><p>Build the image again and compare the size with the previous version:</p>
<pre><code class="lang-bash">$ docker image build -t my-app-small .
$ docker image ls | grep &#39;my-app-&#39;
</code></pre>
<p>As expected, the size of the lean build is much smaller than the large one since it does not contain all the Alpine SDK.</p>
</li>
<li><p>Finally, make sure the app actually works:</p>
<pre><code class="lang-bash">$ docker container run --rm my-app-small
</code></pre>
</li>
</ol>
<h2 id="building-intermediate-images">Building Intermediate Images</h2>
<p>In the previous step, we took our compiled executable from the first build stage, but that image never survived the build process; only the final <code>FROM</code> statement generated an image. In this step, we&#39;ll see how to persist whichever build stage we like.</p>
<ol>
<li><p>Build an image from the <code>build</code> stage in your Dockerfile using the <code>--target</code> flag:</p>
<pre><code class="lang-bash">$ docker image build -t my-build-stage --target build .
</code></pre>
</li>
<li><p>Run a container from this image and make sure it yields the expected result:</p>
<pre><code class="lang-bash">$ docker container run -it --rm my-build-stage /app/bin/hello
</code></pre>
</li>
<li><p>List your images again to see the size of <code>my-build-stage</code> compared to the small version of the app.</p>
</li>
</ol>
<h2 id="conclusion">Conclusion</h2>
<p>In this exercise, you created a Dockerfile defining multiple build stages. Being able to take artifacts like compiled binaries from one image and insert them into another allows you to create very lightweight images that do not include developer tools or other unnecessary components in your production-ready images. This will result in containers that start faster, and are less vulnerable to attack.</p>

        </div>        
    </div>
    <div class="row">
        <ul class="mt-article-pagination" style="display:block;">
        </ul>
    </div>
</div>
    <div class="footer"></div>
</body>