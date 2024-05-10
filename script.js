$(document).ready(() => {

    const $synonymsDiv = $('.synonyms');

    const iconToggler = () => {
        if ($('.switch-main').hasClass('grayed')) {
            $('.icon-lightmode').show();
            $('.icon-darkmode').hide();
        } else {
            $('.icon-lightmode').hide();
            $('.icon-darkmode').show();
        }
    };

    const prefersColorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (prefersColorScheme) {
        $('html').addClass('dark')
    } else {
        $('html').addClass('light')
    }

  

    const defaultMode = () => {
        if ($('html').hasClass('dark')) {
            $('.switch-main').removeClass('grayed');
            $('.inner-switch').addClass('switched');
        } else {
            $('.switch-main').addClass('grayed');
            $('.inner-switch').removeClass('switched');
        }
    }

    defaultMode();

    const fetchData = (url, word = '') => {
        fetch(url + word)
            .then(response => {
                if (!response.ok) {
                    $('.not_found').show();
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const word = data[0].word;
                $('.word').html(word);

                const phonetic = data[0].phonetic;
                $('.pronounce').html(phonetic);

                const meanings = data[0].meanings;
                const $definitionsList = $('<ul>'); 

                meanings.forEach(meaning => {
                    meaning.definitions.forEach(definition => {
                        const $definitionItem = $('<li>'); 
                        $definitionItem.text(definition.definition); 
                        $definitionsList.append($definitionItem); 
                    });
                });

                $('.definitions').html($definitionsList);

    
                $synonymsDiv.empty();


                meanings.forEach(meaning => {
                    meaning.synonyms.forEach(synonym => {
                    const $newSynonym = $('<a></a>'); 
                    $newSynonym.attr('href', `https://api.dictionaryapi.dev/api/v2/entries/en/${synonym}`);
                    
                    $newSynonym.text(synonym); 
                    $synonymsDiv.append($newSynonym); 
                    });
                });

                $definitionsListVerbs = $('<ul>'); 

                data[0].meanings.forEach(meaning => {

                    if(meaning.partOfSpeech === 'verb') {
                        meaning.definitions.forEach(definition => {
                            const $definitionItem = $('<li>'); 
                            $definitionItem.text(definition.definition); 
                            $definitionsListVerbs.append($definitionItem);
                        })
                    }                  
                });

                $('.verb_definitions').html($definitionsListVerbs);
                
                const sourceLink = document.querySelector('.source-link');
                const source = data[0].source;

                const search = $('#search').val().toLowerCase();
                sourceLink.setAttribute('href', `https://en.wiktionary.org/wiki/${search}`);
                sourceLink.setAttribute('target', '_blank');
                sourceLink.innerHTML = `https://en.wiktionary.org/wiki/${search}`;
                    
                $('.play').on('click', function() {
                    

                    let audioUrl = 'data[0].phonetics[0].audio';
                    console.log(audioUrl);
                    const audio = new Audio(audioUrl);
                    audio.play();
                });

            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
        };

        $('.search-icon').on('click', () => {

            if($('#search').val() === '') {
                $('#search').css('border', '1px solid red');
                $('.error').text("This field can't be empty");
                $('.error').slideToggle();
            } else {
                $('.error').slideUp();
                $('#search').css('border', '');
                const word = $('#search').val();
                const url = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
                fetchData(url, word);
            }
            
        


        

        });
    


    $('.switch-main').on('click', (e) => {
        $(e.currentTarget).toggleClass('grayed');
        $('.switch-inner').toggleClass('switched');
        $('html').toggleClass('dark');
        $('html').toggleClass('light');
        iconToggler();
    });

  

    $synonymsDiv.on('click', 'a', function(event) {
        event.preventDefault(); 
    
        const url = $(this).attr('href'); 
        fetchData(url); 
        $('#search').val($(this).text()); 
    });

    $('.font').on('click', ()=> {
        $('.options').slideToggle();
    })

    $('.sans').on('click', (e) => {
        $('body').css('font-family','Inter');
        $('.font').text('Sans Serif');
    })

    $('.serif').on('click', () => {
        $('body').css('font-family','Lora');
        $('.font').text('Serif');
    })

    $('.mono').on('click', () => {
        $('body').css('font-family','Inconsolata');
        $('.font').text('Monospace');
    })

    
    

    iconToggler();
    fetchData('https://api.dictionaryapi.dev/api/v2/entries/en/', $('#search').val().toLowerCase());

});




